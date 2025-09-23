import React from 'react';
import Hero from '../components/Hero';
import FeaturedCourses from '../components/FeaturedCourses';
import InteractiveLearning from '../components/InteractiveLearning';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';

const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedCourses />
      <InteractiveLearning />
      <Testimonials />
    </div>
  );
};

export default Home;