import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Parent of 2 children",
      age: "Kids: 7 & 9 years",
      rating: 5,
      text: "TecaiKids has transformed how my children approach learning. They actually look forward to their daily lessons now! The interactive games make math and science so much fun.",
      avatar: "👩‍💼",
      highlight: "Improved Math Skills by 40%"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Elementary Teacher",
      age: "Teaching Grade 3",
      rating: 5,
      text: "As an educator, I'm impressed by the quality of content and the adaptive learning technology. My students' engagement levels have increased dramatically since we started using TecaiKids.",
      avatar: "👨‍🏫",
      highlight: "Used by 500+ Students"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Homeschool Mom",
      age: "3 kids at home",
      rating: 5,
      text: "The progress tracking and personalized learning paths are incredible. Each of my children learns at their own pace, and I can monitor their development easily.",
      avatar: "👩‍🎓",
      highlight: "Homeschooling Success"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Dad & Software Engineer",
      age: "Daughter: 8 years",
      rating: 5,
      text: "The coding courses are exceptional! My daughter went from knowing nothing about programming to creating her own simple games. The curriculum is well-structured and age-appropriate.",
      avatar: "👨‍💻",
      highlight: "Coding Skills Developed"
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Working Mom",
      age: "Son: 6 years",
      rating: 5,
      text: "With my busy schedule, TecaiKids has been a lifesaver. The bite-sized lessons fit perfectly into our routine, and my son loves the achievement badges and rewards system.",
      avatar: "👩‍💼",
      highlight: "Perfect for Busy Families"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Pediatric Therapist",
      age: "Works with special needs",
      rating: 5,
      text: "The adaptive learning features work wonderfully for children with different learning needs. The platform adjusts beautifully to each child's unique learning style and pace.",
      avatar: "👨‍⚕️",
      highlight: "Inclusive Learning Support"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-600 hover:bg-green-100">Success Stories</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            What Parents &
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Educators Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from families and educators who have experienced the TecaiKids difference 
            in their children's learning journey.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white relative overflow-hidden"
            >
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-blue-600" />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Highlight badge */}
                <Badge className="mb-4 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 hover:from-green-100 hover:to-blue-100">
                  {testimonial.highlight}
                </Badge>

                {/* Author info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-gray-400">{testimonial.age}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-0 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Create Your Success Story?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of families worldwide and give your child the gift of interactive learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full text-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;