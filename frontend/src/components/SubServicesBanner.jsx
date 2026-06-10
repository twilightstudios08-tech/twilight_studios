import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SubServicesBanner = () => {
  const [subServices, setSubServices] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`)
      .then(res => {
        if (res.data) {
          const allItems = [];
          res.data.forEach(svc => {
            if (svc.subServices && svc.subServices.length > 0) {
              svc.subServices.forEach(sub => {
                allItems.push({
                  ...sub,
                  parentSlug: svc.slug,
                  link: `/book?service=${svc.slug}&sub=${sub.slug}`
                });
              });
            } else {
              allItems.push({
                ...svc,
                link: `/book?service=${svc.slug}`
              });
            }
          });
          setSubServices(allItems);
        }
      })
      .catch(console.error);
  }, []);

  if (subServices.length === 0) return null;

  return (
    <section className="relative w-full py-16 md:py-0 md:h-[80vh] md:min-h-[600px] flex items-center justify-center border-y border-white/5 overflow-hidden">
      {/* Background Image - Cinematic full screen banner */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1920&auto=format&fit=crop')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="font-sans text-xs md:text-sm text-gray-400 uppercase tracking-[0.4em] mb-4">
            Specialized Sessions
          </h4>
          <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white uppercase tracking-widest mb-12 drop-shadow-2xl">
            Book Your Slot
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-row md:flex-wrap overflow-x-auto md:overflow-visible w-[100vw] md:w-auto px-6 md:px-0 pb-6 md:pb-0 justify-start md:justify-center gap-4 max-w-4xl mx-auto snap-x no-scrollbar"
        >
          {subServices.map((sub, i) => (
            <Link 
              key={sub._id || i}
              to={sub.link}
              className="px-6 py-3 md:px-8 md:py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-oswald text-sm md:text-xl uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] whitespace-nowrap flex-shrink-0 snap-center"
            >
              {sub.name}
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default SubServicesBanner;

