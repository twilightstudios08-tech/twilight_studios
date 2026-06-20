import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const WhatWeDo = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings`)
      .then(res => {
        if (res.data?.whatWeDo?.length > 0) {
          setItems(res.data.whatWeDo);
        } else {
          // Fallback if not configured
          setItems([
            { title: 'Documentary Weddings', description: '"Every wedding has a unique story, and we capture it as it unfolds. From heartfelt emotions to joyful celebrations, we preserve every moment beautifully. Your love, your journey, told in the most authentic way!"' },
            { title: 'Conceptual Pre Wedding', description: '"A pre-wedding shoot that goes beyond just beautiful frames — it\'s your story, creatively crafted. From dreamy themes to cinematic storytelling, we bring your love to life. Let\'s turn your journey into a timeless visual masterpiece!"' },
            { title: 'Candid & Traditional Photography', description: 'Every picture tells a story, and every frame captures an emotion. At Astiva Creations, we specialize in cinematic storytelling through our photography and videography, making your memories last forever.' },
            { title: 'Cinematic Videography', description: 'At Astiva Creations, we bring the magic of cinema to your special moments with our cinematic videography. Whether it\'s a wedding, pre-wedding, event, or brand film, we craft visually stunning videos that feel like a movie.' },
            { title: 'Impactful Ad Film', description: 'We specialize in high-quality ad film production that brings your brand\'s story to life! Whether it\'s a commercial, corporate video, brand film, or digital ad, we craft visually stunning and engaging content that connects with your audience.' }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-[#050505] py-32 px-6 lg:px-12 text-white border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-oswald text-white text-3xl sm:text-4xl md:text-5xl text-center tracking-[0.3em] mb-20 uppercase font-light"
        >
          What We Do
        </motion.h2>

        {/* CSS grid for Masonry/Variable width look */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`group flex flex-col justify-center items-center p-10 md:p-14 border border-white/20 hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer ${
                index < 2 ? 'w-full md:w-[calc(50%-0.75rem)]' : 'w-full md:w-[calc(33.333%-1rem)]'
              }`}
            >
              <h3 className="font-oswald text-xl md:text-2xl text-center mb-6 tracking-[0.2em] uppercase transition-colors duration-500">
                {item.title}
              </h3>
              <p className="font-sans text-sm md:text-base text-center leading-relaxed font-light opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
