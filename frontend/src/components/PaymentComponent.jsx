import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentComponent = ({ selectedPlan, onClose, onSuccess }) => {
  const { user, ageLevel } = useUser();
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pricingPlan, setPricingPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    loadPaymentMethods();
    loadPricingPlan();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API}/payment-methods`);
      setPaymentMethods(response.data.payment_methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadPricingPlan = async () => {
    try {
      const response = await axios.get(`${API}/pricing/${ageLevel}`);
      setPricingPlan(response.data);
    } catch (error) {
      console.error('Error loading pricing plan:', error);
    }
  };

  const getSelectedAmount = () => {
    if (!pricingPlan) return 0;
    return selectedPlan === 'monthly' ? pricingPlan.monthly_price : pricingPlan.quarterly_price;
  };

  const getSavings = () => {
    if (!pricingPlan || selectedPlan !== 'quarterly') return 0;
    return pricingPlan.quarterly_savings;
  };

  const handlePayment = async () => {
    if (!user || !pricingPlan) {
      toast({
        title: "Error",
        description: "User or pricing information not available.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlan === 'quarterly' && !deliveryAddress.trim()) {
      toast({
        title: "Address Required", 
        description: "Please provide a delivery address for quarterly workbooks.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRequest = {
        user_id: user.id,
        age_level: ageLevel,
        subscription_type: selectedPlan,
        payment_method: selectedPaymentMethod,
        delivery_address: selectedPlan === 'quarterly' ? deliveryAddress : null
      };

      let response;
      
      if (selectedPaymentMethod === 'stripe') {
        response = await axios.post(`${API}/payments/stripe`, paymentRequest);
        
        if (response.data.success && response.data.payment_url) {
          // Redirect to Stripe checkout
          window.location.href = response.data.payment_url;
        }
      } else if (selectedPaymentMethod === 'bank_transfer') {
        response = await axios.post(`${API}/payments/bank-transfer`, paymentRequest);
        
        if (response.data.success) {
          // Show bank transfer details
          setBankTransferDetails(response.data.bank_details);
        }
      } else if (selectedPaymentMethod === 'ezcash') {
        response = await axios.post(`${API}/payments/ezcash`, paymentRequest);
        
        toast({
          title: "Coming Soon",
          description: response.data.message,
          variant: "default"
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const [bankTransferDetails, setBankTransferDetails] = useState(null);

  if (bankTransferDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🏦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Bank Transfer Details
              </h2>
              <p className="text-gray-600">
                Complete your payment using the details below
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <div className="grid gap-4">
                <div>
                  <strong className="text-gray-700">Bank:</strong>
                  <p className="text-lg">{bankTransferDetails.bank_name}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Account Name:</strong>
                  <p className="text-lg">{bankTransferDetails.account_name}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Amount:</strong>
                  <p className="text-2xl font-bold text-blue-600">{bankTransferDetails.amount}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Reference Number:</strong>
                  <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                    {bankTransferDetails.reference}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">Important Instructions:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {bankTransferDetails.instructions.map((instruction, index) => (
                  <li key={index}>• {instruction}</li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => {
                  setBankTransferDetails(null);
                  onClose();
                  if (onSuccess) onSuccess();
                }} 
                className="flex-1"
              >
                I've Made the Transfer
              </Button>
              <Button 
                variant="outline"
                onClick={() => setBankTransferDetails(null)}
                className="flex-1"
              >
                Back to Payment Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Complete Your Subscription
            </h2>
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              ✕
            </Button>
          </div>

          {pricingPlan && (
            <>
              {/* Plan Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {pricingPlan.age_level} - {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
                    </h3>
                    <p className="text-gray-600">{pricingPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      LKR {getSelectedAmount().toLocaleString()}
                    </div>
                    {selectedPlan === 'quarterly' && getSavings() > 0 && (
                      <div className="text-sm text-green-600">
                        Save LKR {getSavings().toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Included Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pricingPlan.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">What You Get:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Digital learning content: LKR {pricingPlan.digital_content_price.toLocaleString()}</li>
                      {selectedPlan === 'quarterly' && (
                        <li>• Physical materials: LKR {pricingPlan.physical_materials_price.toLocaleString()}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Delivery Address for Quarterly Plan */}
              {selectedPlan === 'quarterly' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address for Quarterly Workbooks *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your complete delivery address..."
                    rows="3"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Workbooks will be delivered every quarter (every 3 months)
                  </p>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Choose Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => method.available && setSelectedPaymentMethod(method.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.coming_soon && (
                            <Badge variant="secondary" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                          {method.available && selectedPaymentMethod === method.value && (
                            <Badge className="bg-blue-500">Selected</Badge>
                          )}
                        </div>
                      </div>

                      {method.bank_details && selectedPaymentMethod === method.value && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Transfer to: {method.bank_details.account_holder} - {method.bank_details.bank_name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Button */}
              <div className="flex space-x-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !paymentMethods.find(m => m.value === selectedPaymentMethod)?.available}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 text-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay LKR ${getSelectedAmount().toLocaleString()}`
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} className="px-6">
                  Cancel
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>🔒 Your payment is secure and encrypted</p>
                <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentComponent;