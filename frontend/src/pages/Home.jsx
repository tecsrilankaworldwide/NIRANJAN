import React from 'react';
import Hero from '../components/Hero';
import FeaturedCourses from '../components/FeaturedCourses';
import InteractiveLearning from '../components/InteractiveLearning';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import PricingSection from '../components/PricingSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedCourses />
      <InteractiveLearning />
      <PricingSection />
      <Testimonials />
    </div>
  );
};

export default Home;