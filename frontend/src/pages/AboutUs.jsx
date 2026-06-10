import React from 'react';
import About from '../components/About';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-black">
      
      {/* Wox-style Hero section for About Us */}
      <div className="relative pt-32 pb-24 text-center border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-oswald text-xs text-gray-500 uppercase tracking-[0.5em] mb-4">Behind the Lens</h2>
          <h1 className="font-oswald font-bold text-5xl md:text-7xl text-white uppercase tracking-widest leading-none mb-8">
            Our Story
          </h1>
          <div className="w-16 h-[1px] bg-white mx-auto mb-8"></div>
          <p className="text-gray-400 font-sans font-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto px-6 tracking-wide">
            Twilight Studios was founded with a single mission: to capture life's most precious and fleeting moments with cinematic elegance and unparalleled luxury.
          </p>
        </motion.div>
      </div>
      
      {/* Reuse the Wox-styled About component we built earlier */}
      <About />
      
      {/* Additional Studio Info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center mb-20">
          <h2 className="font-oswald font-bold text-4xl text-white uppercase tracking-widest">
            The Team
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[1, 2, 3].map((member, index) => (
            <motion.div 
              key={member}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group cursor-default"
            >
              <div className="aspect-[3/4] relative overflow-hidden mb-6">
                <img 
                  src={`https://images.unsplash.com/photo-${member === 1 ? '1544005313-94ddf0286df2' : member === 2 ? '1500648767791-00dcc994a43e' : '1554151228-14d9def656e4'}?auto=format&fit=crop&q=80&w=600`} 
                  alt="Team Member" 
                  className="w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
              </div>
              <h3 className="text-2xl font-oswald text-white uppercase tracking-widest mb-2">Lead Artist</h3>
              <p className="text-xs font-sans tracking-[0.3em] text-gray-500 uppercase">Specialist</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
