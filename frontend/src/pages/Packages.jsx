import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Packages = () => {
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Helper to optimize Cloudinary URLs with high quality
  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    if (url.includes('/upload/q_auto')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto:best,w_1200/');
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setServicesData(res.data);
        }
      })
      .catch(err => console.error("Error fetching services", err))
      .finally(() => setIsLoading(false));
  }, []);

  const serviceQuery = searchParams.get('service');
  const subQuery = searchParams.get('sub');

  const filteredServices = servicesData
    .filter(svc => {
      if (serviceQuery && svc.slug !== serviceQuery) return false;
      return true;
    })
    .map(svc => {
      // If a service has direct packages but no sub-services, wrap it so it renders correctly
      let subsToRender = svc.subServices || [];
      if (subsToRender.length === 0 && svc.packages && svc.packages.length > 0) {
        subsToRender = [{
          _id: svc._id,
          name: svc.name,
          slug: svc.slug,
          description: svc.description,
          imageUrl: svc.imageUrl,
          packages: svc.packages
        }];
      }

      if (subQuery) {
        subsToRender = subsToRender.filter(sub => sub.slug === subQuery);
      }

      return {
        ...svc,
        subServices: subsToRender
      };
    })
    .filter(svc => svc.subServices && svc.subServices.length > 0);

  return (
    <div className="pt-32 min-h-screen bg-black pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h2 className="font-oswald text-xs text-gray-500 uppercase tracking-[0.5em] mb-4">Pricing</h2>
          <h1 className="font-oswald font-bold text-5xl md:text-7xl text-white uppercase tracking-widest leading-none">
            Signature<br/>Experiences
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="text-white font-sans text-sm tracking-widest uppercase animate-pulse">Loading Collections...</div>
        ) : (
          <div className="space-y-40">
            {filteredServices.map((svc) => (
              <div key={svc._id} className="space-y-24">
                {/* Optional category header if it has subservices */}
                {svc.subServices && svc.subServices.length > 0 && (
                  <div className="border-t border-white/20 pt-16 mt-16 first:mt-0 first:border-0 first:pt-0">
                    <h2 className="font-oswald text-4xl text-gray-500 tracking-[0.2em] uppercase text-center">{svc.name}</h2>
                    <p className="font-sans text-gray-400 text-center mt-4 max-w-2xl mx-auto">{svc.description}</p>
                  </div>
                )}
                
                {svc.subServices?.map((sub, index) => (
                  <motion.div 
                    key={sub._id || sub.slug}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col lg:flex-row gap-16 lg:gap-24"
                  >
                    {/* Large Image Block */}
                    <div className="lg:w-1/2 w-full">
                      <div className="relative overflow-hidden h-[60vh] md:h-[80vh] group rounded-2xl">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                          style={{ backgroundImage: `url(${optimizeCloudinaryUrl(sub.imageUrl || 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80')})` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-transparent"></div>
                      </div>
                    </div>

                    {/* Typography Content Block */}
                    <div className="lg:w-1/2 w-full flex flex-col justify-center">
                      <h3 className="font-oswald font-bold text-4xl lg:text-5xl text-white uppercase tracking-widest mb-6 leading-none">
                        {sub.name}
                      </h3>
                      <p className="font-sans text-gray-400 font-light leading-relaxed mb-12 text-sm md:text-base">
                        {sub.description}
                      </p>

                      <div className="space-y-12">
                        {(sub.packages || []).map((tier, tIdx) => (
                          <div key={tIdx} className="relative">
                            {tier.isPopular && (
                              <span className="absolute -left-4 top-0 h-full w-[1px] bg-white"></span>
                            )}
                            <h4 className="font-oswald text-xl text-white tracking-widest uppercase mb-2">
                              {tier.name}
                            </h4>
                            <p className="font-sans text-gray-400 text-sm mb-4 font-light leading-relaxed">
                              {tier.features.join(' • ')}
                            </p>
                            <div className="font-sans text-white text-sm tracking-widest uppercase border-b border-white/20 inline-block pb-1">
                              {tier.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-16">
                        <Link 
                          to={`/book?service=${encodeURIComponent(svc.slug)}&sub=${encodeURIComponent(sub.slug)}`}
                          className="group flex items-center gap-4"
                        >
                          <span className="font-oswald text-sm text-white uppercase tracking-[0.3em] group-hover:text-gray-400 transition-colors">
                            Book Slot
                          </span>
                          <div className="h-[1px] w-12 bg-white group-hover:w-24 transition-all duration-500"></div>
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Packages;
