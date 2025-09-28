import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [enrollmentData, setEnrollmentData] = useState({
    childName: '',
    parentName: '',
    email: '',
    phone: '',
    childAge: '',
    selectedProgram: '',
    parentMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // TEC Programs mapping to TEC subscription packages
  const programs = [
    {
      id: 'foundation_monthly',
      name: 'Foundation Level Program',
      ageRange: '5-8 years',
      price: 'LKR 1,200/month',
      icon: '🌱',
      description: 'Basic AI & Logic • Building blocks of future thinking',
      features: [
        'Interactive learning activities',
        'Basic AI literacy concepts',
        'Logical thinking fundamentals',
        'Creative problem solving basics',
        'Pattern recognition games',
        'Age-appropriate challenges'
      ]
    },
    {
      id: 'development_monthly',
      name: 'Development Level Program',
      ageRange: '9-12 years', 
      price: 'LKR 1,800/month',
      icon: '🧠',
      description: 'Logical Thinking & Creativity • Expanding cognitive abilities',
      features: [
        'Advanced logical reasoning',
        'Creative problem solving',
        'AI literacy deep dive',
        'Systems thinking introduction',
        'Interactive brain workouts',
        'Personalized learning paths'
      ]
    },
    {
      id: 'mastery_monthly',
      name: 'Mastery Level Program',
      ageRange: '13-16 years',
      price: 'LKR 2,800/month', 
      icon: '🎯',
      description: 'Future Career Skills • Leadership preparation',
      features: [
        'Future career preparation',
        'Advanced AI applications',
        'Innovation methodologies',
        'Leadership development',
        'Entrepreneurship basics',
        'Real-world project experience'
      ]
    }
  ];

  const handleInputChange = (e) => {
    setEnrollmentData({
      ...enrollmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit enrollment to backend
      const response = await axios.post(`${API}/enrollment/submit`, {
        ...enrollmentData,
        source: 'nina_landing',
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
      
      // After 3 seconds, redirect to TEC platform registration
      setTimeout(() => {
        const selectedProgram = programs.find(p => p.id === enrollmentData.selectedProgram);
        navigate('/register', { 
          state: { 
            email: enrollmentData.email,
            fullName: enrollmentData.parentName,
            childName: enrollmentData.childName,
            selectedPackage: enrollmentData.selectedProgram,
            fromEnrollment: true
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultation = () => {
    // Scroll to contact section or open consultation modal
    document.getElementById('consultation-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 text-center shadow-2xl max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Enrollment Successful!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for enrolling with TEC Future-Ready Learning! You'll be redirected to complete your registration shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Redirecting to TEC Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-3">🚀</span>
              <h1 className="text-5xl font-bold">TecaiKids</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Future-Ready Learning for Sri Lankan Children</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Building tomorrow's minds since 1982. Complete educational ecosystem for ages 4-18 with 
              AI literacy, logical thinking, creative problem solving, and future career skills.
            </p>
            
            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-300">42</div>
                <div className="text-purple-100">Years Excellence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-green-300">1000+</div>
                <div className="text-purple-100">Success Stories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-300">5</div>
                <div className="text-purple-100">Age Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-pink-300">100%</div>
                <div className="text-purple-100">Future Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">🎯 Age-Based Learning Programs</h3>
          <p className="text-xl text-gray-600">Carefully designed curriculum for each developmental stage</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{program.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{program.name}</h4>
                  <p className="text-purple-600 font-medium mb-2">{program.ageRange}</p>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  <div className="text-2xl font-bold text-green-600">{program.price}</div>
                </div>

                <div className="space-y-3 mb-6">
                  {program.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="text-green-500 mr-3">✅</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setEnrollmentData({...enrollmentData, selectedProgram: program.id})}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                    enrollmentData.selectedProgram === program.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {enrollmentData.selectedProgram === program.id ? '✅ Selected' : 'Select Program'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16" id="enrollment-section">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">🚀 Start Your Child's Future Journey</h3>
              <p className="text-purple-100 text-lg">Join thousands of families building future-ready minds</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleEnrollment} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
                    <input
                      type="text"
                      name="childName"
                      required
                      value={enrollmentData.childName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter child's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={enrollmentData.parentName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter parent's full name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={enrollmentData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={enrollmentData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Age *</label>
                  <select
                    name="childAge"
                    required
                    value={enrollmentData.childAge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select child's age</option>
                    {[...Array(15)].map((_, i) => (
                      <option key={i} value={i + 4}>{i + 4} years old</option>
                    ))}
                  </select>
                </div>

                {enrollmentData.selectedProgram && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 mb-2">Selected Program:</p>
                    <p className="text-purple-600">
                      {programs.find(p => p.id === enrollmentData.selectedProgram)?.name} - {programs.find(p => p.id === enrollmentData.selectedProgram)?.price}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                  <textarea
                    name="parentMessage"
                    value={enrollmentData.parentMessage}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any specific requirements or questions about your child's learning journey..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || !enrollmentData.selectedProgram}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold text-lg disabled:opacity-50"
                  >
                    {loading ? '⏳ Processing...' : '🚀 Enroll Now & Access Platform'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleConsultation}
                    className="px-6 py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
                  >
                    💬 Consultation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose TEC Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">🏆 Why Choose TEC Future-Ready Learning?</h3>
          <p className="text-xl text-gray-600">42 years of educational excellence meets cutting-edge AI technology</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🎓</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Proven Excellence</h4>
            <p className="text-gray-600">42 years pioneering educational technology in Sri Lanka</p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🤖</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Learning</h4>
            <p className="text-gray-600">Cutting-edge AI literacy for future readiness</p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🧠</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Logical Thinking</h4>
            <p className="text-gray-600">Interactive workouts for cognitive development</p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">📈</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Progress Tracking</h4>
            <p className="text-gray-600">Detailed analytics and achievement system</p>
          </div>
        </div>
      </div>

      {/* Consultation Section */}
      <div className="bg-gray-100 py-16" id="consultation-section">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">💬 Need Personalized Guidance?</h3>
          <p className="text-xl text-gray-600 mb-8">Speak with our education experts to find the perfect program for your child</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📞</div>
              <h4 className="font-bold mb-2">Phone Consultation</h4>
              <p className="text-gray-600 mb-4">Direct call with learning specialists</p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Schedule Call
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">💻</div>
              <h4 className="font-bold mb-2">Virtual Demo</h4>
              <p className="text-gray-600 mb-4">Live platform walkthrough</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book Demo
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📧</div>
              <h4 className="font-bold mb-2">Email Support</h4>
              <p className="text-gray-600 mb-4">Detailed program information</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">🚀 TecaiKids</h4>
              <p className="text-gray-300 mb-4">
                Building tomorrow's minds with 42 years of educational excellence and cutting-edge AI technology.
              </p>
              <p className="text-sm text-gray-400">TEC Sri Lanka Worldwide (Pvt.) Ltd</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Programs</h5>
              <div className="space-y-2 text-gray-300">
                <p>🌱 Foundation (4-8 years)</p>
                <p>🧠 Development (9-12 years)</p>
                <p>🎯 Mastery (13-18 years)</p>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact</h5>
              <div className="space-y-2 text-gray-300">
                <p>📧 info@tecaikids.com</p>
                <p>📞 +94 XX XXX XXXX</p>
                <p>🏢 Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 TEC Sri Lanka Worldwide (Pvt.) Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;