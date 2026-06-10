import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const WhatWeOffer = () => {
  const [subServices, setSubServices] = useState([]);

  // Helper to optimize Cloudinary URLs with high quality
  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    if (url.includes('/upload/q_auto')) return url;
    // f_auto for speed, q_auto:best for high quality, w_1200 to cap extreme sizes
    return url.replace('/upload/', '/upload/f_auto,q_auto:best,w_1200/');
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          const allItems = [];
          res.data.forEach(svc => {
            if (svc.subServices && svc.subServices.length > 0) {
              svc.subServices.forEach(sub => {
                allItems.push({
                  ...sub,
                  parentSlug: svc.slug,
                  link: `/packages?service=${encodeURIComponent(svc.slug)}&sub=${encodeURIComponent(sub.slug)}`
                });
              });
            } else {
              // If a service has no subservices, just show the service itself
              allItems.push({
                ...svc,
                link: `/packages?service=${encodeURIComponent(svc.slug)}`
              });
            }
          });
          setSubServices(allItems);
        } else {
          setSubServices([
            {
              name: 'Maternity',
              description: 'Celebrate the beauty of motherhood with our elegant, high-fashion maternity sessions.',
              imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000',
              link: '/packages'
            },
            {
              name: 'Newborn',
              description: 'Capture the purest, most delicate moments of your newborn\'s first days.',
              imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=1000',
              link: '/packages'
            },
            {
              name: 'Family',
              description: 'Timeless cinematic portraits of the people you love most.',
              imageUrl: 'https://images.unsplash.com/photo-1517594539167-a8dc824c0d05?q=80&w=1000',
              link: '/packages'
            }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  const displayServices = [
    ...subServices,
    {
      _id: 'wedding-hardcoded',
      name: 'Wedding',
      description: 'Exquisite cinematic storytelling for your special day. From grand celebrations to intimate moments.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000'
    }
  ];

  return (
    <section id="experiences" className="bg-[#020202] py-32 px-6 lg:px-12 text-white relative z-10">
      <div className="max-w-[90rem] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-16 md:mb-24 flex flex-col items-center md:items-start"
        >
          <div>
            <h4 className="font-sans text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-4">Curated Offerings</h4>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-widest leading-none">
              Signature<br className="hidden md:block" /> Experiences
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((svc, i) => (
            <motion.div 
              key={svc._id || i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              onClick={() => {
                if (svc.name.toLowerCase() === 'wedding') {
                  window.open('https://astitvacreations.com', '_blank', 'noopener,noreferrer');
                }
              }}
              className="group relative h-[600px] w-full overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-80 transition-all duration-1000 scale-110 group-hover:scale-100 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${optimizeCloudinaryUrl(svc.imageUrl || 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80')})` }}
              ></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>

              {/* Default Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end transition-transform duration-700 group-hover:-translate-y-8">
                <h3 className="font-oswald text-4xl md:text-5xl text-white uppercase tracking-widest leading-none mb-6">
                  {svc.name}
                </h3>
                <div className="h-[1px] w-12 bg-white/20 mb-6 group-hover:w-full transition-all duration-700 ease-in-out"></div>
                
                {/* Hidden Description (Reveals on Hover) */}
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-700 delay-100">
                  <p className="font-sans text-xs text-gray-300 tracking-wider leading-relaxed mb-6">
                    {svc.description}
                  </p>
                  <a href={svc.name.toLowerCase() === 'wedding' ? "https://astitvacreations.com" : svc.link}
                     target={svc.name.toLowerCase() === 'wedding' ? "_blank" : "_self"}
                     rel="noopener noreferrer"
                     onClick={(e) => {
                       // prevent parent div onClick if clicking link directly
                       if(svc.name.toLowerCase() === 'wedding') e.stopPropagation(); 
                     }}
                     className="inline-block text-[9px] font-sans text-white uppercase tracking-[0.3em] border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors">
                    {svc.name.toLowerCase() === 'wedding' ? 'Explore Wedding' : 'View Details'}
                  </a>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatWeOffer;
