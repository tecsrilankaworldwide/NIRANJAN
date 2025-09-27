import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SubscriptionPage = () => {
  const { user, token, getLearningLevel, hasSubscription } = useAuth();
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API}/subscription/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (subscriptionType, ageGroup) => {
    try {
      setProcessingPayment(`${ageGroup}-${subscriptionType}`);
      
      const response = await axios.post(`${API}/subscription/checkout`, {
        subscription_type: subscriptionType,
        age_group: ageGroup,
        success_url: `${window.location.origin}/dashboard?payment=success`,
        cancel_url: `${window.location.origin}/subscription?payment=cancelled`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const getLevelInfo = (ageGroup) => {
    const levels = {
      '5-8': {
        name: 'Foundation Level',
        icon: '🌱',
        color: 'from-green-500 to-emerald-600',
        description: 'Building blocks of future thinking',
        skills: ['Basic AI Understanding', 'Simple Logic', 'Creative Play', 'Problem Recognition']
      },
      '9-12': {
        name: 'Development Level',
        icon: '🧠', 
        color: 'from-blue-500 to-cyan-600',
        description: 'Expanding logical and creative thinking',
        skills: ['Logical Reasoning', 'AI Applications', 'Design Thinking', 'Complex Problem Solving']
      },
      '13-16': {
        name: 'Mastery Level',
        icon: '🎯',
        color: 'from-purple-500 to-indigo-600',
        description: 'Future career and leadership preparation',
        skills: ['Advanced AI', 'Innovation Methods', 'Leadership', 'Future Career Navigation']
      }
    };
    return levels[ageGroup] || levels['9-12'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  const userLevelInfo = getLevelInfo(user?.age_group);
  const userAgeGroup = user?.age_group;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">💎</div>
            <h1 className="text-4xl font-bold mb-4">
              {hasSubscription ? 'Your Premium Access' : 'Unlock Future-Ready Learning'}
            </h1>
            <p className="text-xl text-purple-100 mb-6">
              {hasSubscription 
                ? 'You have premium access to all features!' 
                : 'Complete educational ecosystem with digital content + physical materials'}
            </p>
            {userAgeGroup && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl">{userLevelInfo.icon}</span>
                  <div>
                    <p className="font-semibold">{userLevelInfo.name}</p>
                    <p className="text-sm text-purple-100">Ages {userAgeGroup} • {userLevelInfo.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {hasSubscription ? (
          /* Current Subscription Status */
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Premium Access Active!</h2>
              <p className="text-green-700 mb-6">
                You have unlimited access to all courses, materials, and features for your {userLevelInfo.name}.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ What You Have:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All digital courses</li>
                    <li>• Physical learning materials</li>
                    <li>• Progress tracking</li>
                    <li>• Future-ready curriculum</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Your Level Features:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {userLevelInfo.skills.slice(0, 4).map((skill, index) => (
                      <li key={index}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Subscription Plans */
          <div>
            {/* Your Level Recommendation */}
            {userAgeGroup && plans[userAgeGroup === '5-8' ? 'foundation' : userAgeGroup === '9-12' ? 'development' : 'mastery'] && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Recommended For You</h2>
                  <p className="text-gray-600">Based on your age group: {userAgeGroup}</p>
                </div>

                <div className="max-w-4xl mx-auto">
                  {renderLevelPlans(userAgeGroup, userLevelInfo, true)}
                </div>
              </div>
            )}

            {/* All Available Plans */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">All Learning Levels Available</h2>
              <div className="space-y-12">
                {Object.entries(plans).map(([levelKey, levelPlans]) => {
                  const ageGroupMap = {
                    'foundation': '5-8',
                    'development': '9-12', 
                    'mastery': '13-16'
                  };
                  const ageGroup = ageGroupMap[levelKey];
                  const levelInfo = getLevelInfo(ageGroup);
                  
                  return (
                    <div key={levelKey}>
                      {renderLevelPlans(ageGroup, levelInfo, ageGroup === userAgeGroup)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parent Testimonials */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Parents Are Saying</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">👩‍💼</div>
                    <h4 className="font-bold text-gray-800">Dr. Kamani Wijeratne</h4>
                    <p className="text-sm text-gray-500">Parent, Colombo</p>
                  </div>
                  <p className="text-gray-700 italic">"My 10-year-old daughter loves the AI courses! She's now explaining machine learning concepts to us at dinner. TEC's approach makes complex topics so accessible."</p>
                  <div className="text-yellow-500 text-center mt-4">⭐⭐⭐⭐⭐</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">👨‍💻</div>
                    <h4 className="font-bold text-gray-800">Eng. Roshan Fernando</h4>
                    <p className="text-sm text-gray-500">Parent, Kandy</p>
                  </div>
                  <p className="text-gray-700 italic">"As a tech professional, I'm amazed by the curriculum quality. My son is already thinking like a future innovator. Best investment for his future!"</p>
                  <div className="text-yellow-500 text-center mt-4">⭐⭐⭐⭐⭐</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">👩‍🏫</div>
                    <h4 className="font-bold text-gray-800">Mrs. Sanduni Perera</h4>
                    <p className="text-sm text-gray-500">Parent & Educator, Galle</p>
                  </div>
                  <p className="text-gray-700 italic">"The physical materials complement digital learning perfectly. My twins are building robots while learning programming. TEC understands how children learn best."</p>
                  <div className="text-yellow-500 text-center mt-4">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="mb-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 border border-green-200">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Impact on Young Minds</h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-2">🎓</div>
                  <div className="text-3xl font-bold text-green-700">50,000+</div>
                  <p className="text-green-600 font-medium">Students Educated</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-3xl font-bold text-green-700">95%</div>
                  <p className="text-green-600 font-medium">Parent Satisfaction</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="text-3xl font-bold text-green-700">200+</div>
                  <p className="text-green-600 font-medium">International Awards</p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🚀</div>
                  <div className="text-3xl font-bold text-green-700">42</div>
                  <p className="text-green-600 font-medium">Years of Innovation</p>
                </div>
              </div>
            </div>

            {/* Company Trust Section */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 text-center border border-indigo-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted by Families Since 1982</h3>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                TEC Sri Lanka Worldwide (Pvt.) Ltd has been pioneering future-ready education for 42 years. 
                All payments are processed securely under our registered company name.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-white/60 p-4 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="text-xl mb-2">🖥️</div>
                  <h4 className="font-semibold mb-2">1982: Computer Pioneer</h4>
                  <p className="text-gray-600">First to bring computer education to Sri Lankan children</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="text-xl mb-2">🤖</div>
                  <h4 className="font-semibold mb-2">2004: Robotics Leader</h4>
                  <p className="text-gray-600">Introduced robotics with LEGO Dacta Denmark</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg hover:bg-white/80 transition-colors">
                  <div className="text-xl mb-2">🚀</div>
                  <h4 className="font-semibold mb-2">2024: AI Future-Ready</h4>
                  <p className="text-gray-600">Complete platform for tomorrow's skills</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderLevelPlans(ageGroup, levelInfo, isRecommended = false) {
    const levelKey = ageGroup === '5-8' ? 'foundation' : ageGroup === '9-12' ? 'development' : 'mastery';
    const levelPlans = plans[levelKey];
    
    if (!levelPlans) return null;

    return (
      <div className={`bg-white rounded-2xl shadow-xl border-2 ${isRecommended ? 'border-purple-200 ring-2 ring-purple-100' : 'border-gray-100'} overflow-hidden`}>
        {isRecommended && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2">
            <span className="font-semibold">⭐ Recommended for Your Age Group</span>
          </div>
        )}
        
        {/* Level Header */}
        <div className={`bg-gradient-to-r ${levelInfo.color} text-white p-8`}>
          <div className="text-center">
            <div className="text-4xl mb-4">{levelInfo.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{levelInfo.name}</h3>
            <p className="text-lg opacity-90 mb-4">{levelInfo.description}</p>
            <div className="bg-white/20 rounded-lg p-3">
              <p className="font-semibold">Ages {ageGroup}</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            {levelPlans.monthly && (
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Monthly Access</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    LKR {levelPlans.monthly.price.toLocaleString()}
                  </div>
                  <p className="text-gray-500">per month</p>
                </div>

                <div className="space-y-3 mb-6">
                  {levelPlans.monthly.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe('monthly', ageGroup)}
                  disabled={processingPayment === `${ageGroup}-monthly`}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50"
                >
                  {processingPayment === `${ageGroup}-monthly` ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    'Start Monthly Plan →'
                  )}
                </button>
              </div>
            )}

            {/* Quarterly Plan (Most Popular) */}
            {levelPlans.quarterly && (
              <div className="border-2 border-orange-300 rounded-xl p-6 relative hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular + Materials
                </div>
                
                <div className="text-center mb-6 mt-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Quarterly + Materials</h4>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    LKR {levelPlans.quarterly.total_price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="line-through">LKR {(levelPlans.quarterly.digital_price + levelPlans.quarterly.materials_price + (levelPlans.quarterly.digital_price * 0.15)).toLocaleString()}</span>
                    <span className="text-green-600 font-semibold ml-2">Save 15%</span>
                  </div>
                  <p className="text-gray-500">for 3 months + physical kit</p>
                </div>

                <div className="space-y-3 mb-6">
                  {levelPlans.quarterly.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/60 p-3 rounded-lg mb-4">
                  <p className="text-sm font-semibold text-orange-800 mb-1">🎁 Included Physical Kit:</p>
                  <p className="text-xs text-orange-700">Learning materials, activity books, and hands-on projects delivered to your home</p>
                </div>

                <button
                  onClick={() => handleSubscribe('quarterly', ageGroup)}
                  disabled={processingPayment === `${ageGroup}-quarterly`}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  {processingPayment === `${ageGroup}-quarterly` ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    'Get Quarterly + Kit →'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Level Skills */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-4">🎯 Skills Developed at {levelInfo.name}:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {levelInfo.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SubscriptionPage;