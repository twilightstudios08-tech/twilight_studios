import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import ThemesPreview from '../components/ThemesPreview';
import GalleryPreview from '../components/GalleryPreview';
import WhatWeOffer from '../components/WhatWeOffer';
import SubServicesBanner from '../components/SubServicesBanner';
import OfferingsText from '../components/OfferingsText';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <WhatWeOffer />
      <SubServicesBanner />
      <GalleryPreview />
      <ThemesPreview />
      <OfferingsText />
    </div>
  );
};

export default Home;
