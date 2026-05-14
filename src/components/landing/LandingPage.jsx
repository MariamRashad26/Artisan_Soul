import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Craftsmanship from './Craftsmanship';
import Collections from './Collections';
import Process from './Process';
import Testimonials from './Testimonials';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-page font-display bg-white min-vh-100">
      <Navbar />
      <Hero />
      <Craftsmanship />
      <Collections />
      <Process />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
