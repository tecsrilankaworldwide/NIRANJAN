import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, Star, BookOpen, Package } from 'lucide-react';

const PricingSection = () => {
  const [selectedAge, setSelectedAge] = useState('5-8');

  const pricingTiers = {
    '5-8': {
      ageGroup: 'Early Learners (Ages 5-8)',
      monthly: {
        price: 'LKR 1,000',
        description: 'Digital access only',
        features: [
          'Interactive learning games',
          'Basic math & reading',
          'Creative activities',
          'Progress tracking',
          'Parent dashboard'
        ]
      },
      quarterly: {
        price: 'LKR 4,050',
        digitalPrice: 'LKR 2,550',
        materialsPrice: 'LKR 1,500',
        description: '15% off digital + Free shipping',
        savings: 'Save LKR 450',
        features: [
          'All digital content (3 months)',
          'Physical term book',
          'Practical work kit',
          'Art & craft materials',
          'Free shipping across Sri Lanka',
          'Priority support'
        ]
      }
    },
    '9-12': {
      ageGroup: 'Middle Learners (Ages 9-12)',
      monthly: {
        price: 'LKR 1,500',
        description: 'Digital access only',
        features: [
          'Advanced courses',
          'Science experiments',
          'Coding basics',
          'Project-based learning',
          'Mentor support'
        ]
      },
      quarterly: {
        price: 'LKR 5,325',
        digitalPrice: 'LKR 3,825',
        materialsPrice: 'LKR 1,500',
        description: '15% off digital + Free shipping',
        savings: 'Save LKR 675',
        features: [
          'All digital content (3 months)',
          'Advanced learning kit',
          'Science experiment kit',
          'Coding workbook',
          'Free shipping across Sri Lanka',
          'Weekly mentor sessions'
        ]
      }
    },
    '13-16': {
      ageGroup: 'Teen Academy (Ages 13-16)',
      monthly: {
        price: 'LKR 2,500',
        description: 'Digital access only',
        features: [
          'Professional courses',
          'Real-world projects',
          'Industry mentorship',
          'Certification prep',
          'Career guidance'
        ]
      },
      quarterly: {
        price: 'LKR 7,875',
        digitalPrice: 'LKR 6,375',
        materialsPrice: 'LKR 1,500',
        description: '15% off digital + Free shipping',
        savings: 'Save LKR 1,125',
        features: [
          'All digital content (3 months)',
          'Professional toolkit',
          'Hardware components',
          'Reference materials',
          'Free shipping across Sri Lanka',
          '1-on-1 career counseling'
        ]
      }
    }
  };

  const currentTier = pricingTiers[selectedAge];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">TEC Sri Lanka Pricing</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Affordable Learning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> for Every Family</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your child's learning journey. All prices in Sri Lankan Rupees.
          </p>
        </div>

        {/* Age Group Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-100 rounded-full p-1">
            {Object.keys(pricingTiers).map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedAge === age
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Ages {age}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Monthly Plan</CardTitle>
              <p className="text-gray-600">{currentTier.monthly.description}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">{currentTier.monthly.price}</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {currentTier.monthly.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-full">
                Start Monthly Plan
              </Button>
            </CardContent>
          </Card>

          {/* Quarterly Plan (Popular) */}
          <Card className="shadow-2xl border-2 border-purple-500 hover:shadow-3xl transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Quarterly Plan</CardTitle>
              <p className="text-gray-600">{currentTier.quarterly.description}</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {currentTier.quarterly.savings} ✨
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">{currentTier.quarterly.price}</div>
                <div className="text-gray-500 mb-4">per quarter</div>
                
                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Digital Content (3 months):</span>
                    <span className="font-medium">{currentTier.quarterly.digitalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Physical Materials & Kit:</span>
                    <span className="font-medium">{currentTier.quarterly.materialsPrice}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{currentTier.quarterly.price}</span>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {currentTier.quarterly.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full">
                Choose Quarterly Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Corporate Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Powered by TEC Sri Lanka Worldwide (Pvt.) Ltd
            </h3>
            <p className="text-gray-600 mb-6">
              A trusted Sri Lankan education technology company committed to providing 
              world-class learning experiences for children across the island.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">15K+</div>
                <div className="text-sm text-gray-600">Students Served</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Parent Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex justify-center items-center space-x-8 text-gray-500">
          <div className="text-sm">🔒 Secure Payments</div>
          <div className="text-sm">🚚 Island-wide Delivery</div>
          <div className="text-sm">📞 Local Support</div>
          <div className="text-sm">🏆 Award Winning</div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;