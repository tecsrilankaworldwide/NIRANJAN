import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PaymentComponent from '../components/PaymentComponent';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const { user, ageLevel } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pricingPlans, setPricingPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('quarterly');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    loadPricingPlans();
  }, []);

  const loadPricingPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/pricing`);
      setPricingPlans(response.data.pricing_plans);
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing plans.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planAgeLevel, cycle) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please create your profile first to subscribe.",
        variant: "destructive"
      });
      navigate('/unified-age-selector');
      return;
    }

    setSelectedPlan({ ageLevel: planAgeLevel, cycle });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast({
      title: "Success!",
      description: "Your subscription has been activated successfully.",
      variant: "default"
    });
    navigate('/unified-dashboard');
  };

  const ageLevelOrder = ['4-6', '7-9', '10-12', '13-15', '16-18'];
  const orderedPlans = ageLevelOrder.map(level => ({
    level,
    plan: pricingPlans[level]
  })).filter(item => item.plan);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            Affordable Learning for Everyone
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learning Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock unlimited access to courses, quizzes, and quarterly workbooks. 
            Start your learning journey with TecaiKids today!
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-lg shadow-md flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-6 py-3 rounded-md font-medium transition-all relative ${
                billingCycle === 'quarterly'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Quarterly
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1">
                Save 25%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mb-16">
          {orderedPlans.map((item) => {
            const plan = item.plan;
            const isCurrentUserPlan = user && ageLevel === item.level;
            const price = billingCycle === 'monthly' ? plan.monthly_price : plan.quarterly_price;
            const savings = billingCycle === 'quarterly' ? plan.quarterly_savings : 0;

            const getCardColor = (level) => {
              const colors = {
                '4-6': 'from-yellow-400 to-orange-500',
                '7-9': 'from-blue-500 to-purple-600',
                '10-12': 'from-purple-600 to-pink-600',
                '13-15': 'from-indigo-600 to-blue-600',
                '16-18': 'from-green-600 to-teal-600'
              };
              return colors[level] || 'from-gray-400 to-gray-600';
            };

            const getEmoji = (level) => {
              const emojis = {
                '4-6': '🌟',
                '7-9': '🚀', 
                '10-12': '⚡',
                '13-15': '💻',
                '16-18': '🎯'
              };
              return emojis[level] || '📚';
            };

            const getTitle = (level) => {
              const titles = {
                '4-6': 'Little Learners',
                '7-9': 'Young Explorers',
                '10-12': 'Smart Kids', 
                '13-15': 'Tech Teens',
                '16-18': 'Future Leaders'
              };
              return titles[level] || 'Learning Plan';
            };

            return (
              <Card 
                key={item.level} 
                className={`relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${
                  isCurrentUserPlan ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${getCardColor(item.level)}`} />
                
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getCardColor(item.level)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">{getEmoji(item.level)}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800">{getTitle(item.level)}</h3>
                    <p className="text-sm text-gray-600">Ages {item.level}</p>
                    
                    {isCurrentUserPlan && (
                      <Badge className="mt-2 bg-blue-500">Your Level</Badge>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      LKR {price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      per {billingCycle}
                    </div>
                    
                    {savings > 0 && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save LKR {savings.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {billingCycle === 'quarterly' && (
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700 font-medium">
                          Quarterly workbook delivery
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-6 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Digital Content:</span>
                      <span>LKR {plan.digital_content_price.toLocaleString()}</span>
                    </div>
                    {billingCycle === 'quarterly' && (
                      <div className="flex justify-between">
                        <span>Physical Materials:</span>
                        <span>LKR {plan.physical_materials_price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleSubscribe(item.level, billingCycle)}
                    className={`w-full bg-gradient-to-r ${getCardColor(item.level)} hover:opacity-90 text-white font-bold py-3`}
                  >
                    {isCurrentUserPlan ? 'Upgrade Plan' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            What's Included in Every Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Unlimited Access",
                description: "Access to all age-appropriate courses and quizzes",
                features: ["Interactive lessons", "Progress tracking", "Achievement system"]
              },
              {
                icon: "📚",
                title: "Quality Content",
                description: "Curriculum designed by education experts",
                features: ["Logical thinking", "Algorithmic thinking", "STEM subjects"]
              },
              {
                icon: "📦",
                title: "Physical Materials",
                description: "Quarterly workbooks delivered to your door",
                features: ["Hands-on activities", "Offline learning", "Parent guidance"]
              }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "What's the difference between monthly and quarterly plans?",
                answer: "Quarterly plans include physical workbooks delivered every 3 months and save you 25% compared to monthly billing. Monthly plans are digital-only."
              },
              {
                question: "Can I change my plan later?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept credit/debit cards via Stripe and direct bank transfers to Bank of Ceylon. eZ Cash integration is coming soon."
              },
              {
                question: "Is there a free trial?",
                answer: "You can explore sample content before subscribing. Our age selector will show you what's included in your child's level."
              },
              {
                question: "What's included in the quarterly workbooks?",
                answer: "Physical workbooks contain hands-on activities, puzzles, exercises, and projects designed to complement the digital learning experience."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students already learning with TecaiKids
          </p>
          <Button 
            onClick={() => navigate('/unified-age-selector')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentComponent
          selectedPlan={selectedPlan.cycle}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PricingPage;