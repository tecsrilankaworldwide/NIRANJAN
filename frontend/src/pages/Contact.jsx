import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      content: "hello@tecaikids.com",
      description: "Send us an email anytime",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Phone,
      title: "Phone Support",
      content: "+1 (555) 123-KIDS",
      description: "Mon-Fri, 9AM-6PM PST",
      color: "from-green-400 to-green-600"
    },
    {
      icon: MapPin,
      title: "Office Location",
      content: "San Francisco, CA",
      description: "123 Learning Street",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We respond quickly",
      color: "from-orange-400 to-orange-600"
    }
  ];

  const faqItems = [
    {
      question: "Is TecaiKids safe for children?",
      answer: "Yes! We follow strict COPPA compliance guidelines and have comprehensive safety measures in place to protect children's privacy and ensure age-appropriate content."
    },
    {
      question: "What ages is TecaiKids suitable for?",
      answer: "TecaiKids is designed for children ages 4-12, with content specifically tailored to different age groups and learning levels."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to our premium features. No credit card required to start."
    },
    {
      question: "Can parents track their child's progress?",
      answer: "Absolutely! Our parent dashboard provides detailed progress reports, learning analytics, and personalized recommendations."
    },
    {
      question: "What devices are supported?",
      answer: "TecaiKids works on tablets, smartphones, laptops, and desktop computers. We support all major browsers and operating systems."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties."
    }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'technical', label: 'Technical Support', icon: HelpCircle },
    { value: 'billing', label: 'Billing Question', icon: Mail },
    { value: 'partnership', label: 'Partnership', icon: Users }
  ];

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">Get in Touch</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              We're Here to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Help!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about TecaiKids? Need technical support? Want to partner with us? 
              We'd love to hear from you and help you on your learning journey.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {info.title}
                    </h3>
                    <p className="text-gray-800 font-medium mb-1">{info.content}</p>
                    <p className="text-gray-500 text-sm">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {supportCategories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.value}
                              type="button"
                              onClick={() => setFormData({...formData, category: category.value})}
                              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-300 ${
                                formData.category === category.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 hover:border-blue-400 text-gray-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{category.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300 resize-none"
                        placeholder="Tell us more about your question or feedback..."
                      ></textarea>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">{item.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Help */}
              <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Need More Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Check out our comprehensive help center with guides, tutorials, and troubleshooting tips.
                  </p>
                  <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white">
                    Visit Help Center
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Child's Learning Adventure?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of families who trust TecaiKids for their children's education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;