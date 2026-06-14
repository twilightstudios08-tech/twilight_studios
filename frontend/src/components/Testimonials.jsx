import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/testimonials`)
      .then(res => {
        setTestimonials(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative w-full py-24 bg-[#0a0a0a] text-white flex flex-col items-center">
      <h2 className="font-serif text-white text-3xl md:text-4xl mb-24 md:mb-32 text-center tracking-wide">
        Testimonials
      </h2>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative flex flex-row items-center justify-center gap-2 sm:gap-8 md:gap-16">
        
        {/* Left Arrow */}
        <button onClick={handlePrev} className="text-[#a0a0a0] hover:text-white transition-colors text-lg md:text-xl font-light p-2 sm:p-4 z-10 flex-shrink-0">
          &#8249;
        </button>
        
        {/* Content */}
        <div className="flex-1 relative h-[300px] md:h-[250px] flex items-center justify-center text-center px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="font-serif font-light text-base md:text-lg text-gray-400 italic mb-10 leading-relaxed max-w-2xl">
                {current.reviewText}
              </p>
              
              <div className="flex text-white mb-6 text-[10px] gap-3">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              
              <h3 className="font-sans text-gray-500 uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-4">
                {current.authorName}
              </h3>

              {current.googleReviewUrl && (
                <a 
                  href={current.googleReviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-sans font-bold mt-2"
                >
                  G <span className="font-medium tracking-[0.2em]">VERIFIED GOOGLE REVIEW</span> &#8599;
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button onClick={handleNext} className="text-[#a0a0a0] hover:text-white transition-colors text-lg md:text-xl font-light p-2 sm:p-4 z-10 flex-shrink-0">
          &#8250;
        </button>

      </div>

    </section>
  );
};

export default Testimonials;
