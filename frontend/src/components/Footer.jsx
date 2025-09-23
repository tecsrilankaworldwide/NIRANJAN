import React from 'react';
import { Button } from './ui/button';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    "Learning": [
      { name: "Math Adventures", href: "/courses/math" },
      { name: "Science Explorers", href: "/courses/science" },
      { name: "Creative Writing", href: "/courses/writing" },
      { name: "Art & Design", href: "/courses/art" },
      { name: "Coding for Kids", href: "/courses/coding" }
    ],
    "Parents": [
      { name: "Progress Reports", href: "/parents/progress" },
      { name: "Safety Guidelines", href: "/safety" },
      { name: "Learning Tips", href: "/parents/tips" },
      { name: "FAQ", href: "/faq" },
      { name: "Support", href: "/support" }
    ],
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press Kit", href: "/press" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/tecaikids", color: "hover:text-blue-600" },
    { icon: Twitter, href: "https://twitter.com/tecaikids", color: "hover:text-blue-400" },
    { icon: Instagram, href: "https://instagram.com/tecaikids", color: "hover:text-pink-500" },
    { icon: Youtube, href: "https://youtube.com/tecaikids", color: "hover:text-red-500" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TecaiKids
                </h1>
                <p className="text-sm text-gray-400">Learn & Grow</p>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Empowering children worldwide with interactive, engaging, and safe learning experiences 
              that build confidence and spark curiosity for lifelong learning.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">hello@tecaikids.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">+1 (555) 123-KIDS</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 text-gray-400 ${social.color}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Get the latest learning activities, tips, and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TecaiKids. All rights reserved. Made with ❤️ for children everywhere.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;