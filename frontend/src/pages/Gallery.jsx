import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMediaType, setActiveMediaType] = useState('image');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Helper to optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url, isThumbnail = true) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    if (url.includes('/upload/f_auto')) return url;
    if (isThumbnail) {
      return url.replace('/upload/', '/upload/f_auto,q_auto:best,w_800,c_limit/');
    }
    return url.replace('/upload/', '/upload/f_auto,q_auto:best,w_1920,c_limit/');
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/gallery`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setImages(res.data);
          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(res.data.map(img => img.category))];
          setCategories(uniqueCategories);
        } else {
          // Fallback data
          const fallback = [
            { id: 1, category: 'Maternity', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000' },
            { id: 2, category: 'Newborn', url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=1000' },
            { id: 3, category: 'Baby', url: 'https://images.unsplash.com/photo-1519759312658-0ce400821ec9?q=80&w=1000' },
            { id: 4, category: 'Family', url: 'https://images.unsplash.com/photo-1517594539167-a8dc824c0d05?q=80&w=1000' }
          ];
          setImages(fallback);
          setCategories(['All', 'Maternity', 'Newborn', 'Baby', 'Family']);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const categoryFiltered = filter === 'All' ? images : images.filter(img => img.category === filter);
  const filteredImages = categoryFiltered.filter(img => activeMediaType === 'video' ? img.type === 'video' : img.type !== 'video');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  const getYouTubeId = (url) => {
    if(!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-oswald text-xs text-gray-500 uppercase tracking-[0.5em] mb-4">Portfolio</h2>
          <h1 className="font-oswald font-bold text-5xl md:text-7xl text-white uppercase tracking-widest leading-none">
            Cinematic Gallery
          </h1>
          <div className="w-12 h-[1px] bg-white mx-auto mt-8 mb-12"></div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
                  filter === cat 
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105' 
                  : 'bg-transparent border border-white/20 text-gray-400 hover:text-white hover:border-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Media Type Toggles */}
          <div className="flex justify-center gap-2 mt-8">
            <button 
              onClick={() => { setActiveMediaType('image'); setLightboxIndex(null); }}
              className={`px-6 py-2 rounded-full font-oswald text-[10px] tracking-widest uppercase transition-all duration-300 ${
                activeMediaType === 'image' 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                : 'bg-black/40 border border-white/20 text-gray-400 hover:text-white'
              }`}
            >
              Images
            </button>
            <button 
              onClick={() => { setActiveMediaType('video'); setLightboxIndex(null); }}
              className={`px-6 py-2 rounded-full font-oswald text-[10px] tracking-widest uppercase transition-all duration-300 ${
                activeMediaType === 'video' 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                : 'bg-black/40 border border-white/20 text-gray-400 hover:text-white'
              }`}
            >
              Videos
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img._id || img.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group overflow-hidden bg-black break-inside-avoid shadow-2xl mb-6"
                  onClick={() => img.type !== 'video' && setLightboxIndex(index)}
                >
                  {img.type === 'video' ? (
                    <div className="relative w-full h-64 bg-black">
                      <iframe 
                        src={`https://www.youtube.com/embed/${getYouTubeId(img.url)}`} 
                        className="absolute inset-0 w-full h-full" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen 
                        frameBorder="0" 
                      />
                    </div>
                  ) : (
                    <img 
                      src={optimizeCloudinaryUrl(img.url, true)} 
                      alt={img.category} 
                      loading="lazy"
                      className="w-full h-auto object-cover opacity-80 group-hover:scale-[1.02] group-hover:opacity-100 transition-all duration-700 cursor-pointer" 
                    />
                  )}
                  
                  {img.type !== 'video' && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  )}
                  
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] text-white uppercase tracking-widest border border-white/20 shadow-xl">
                      {img.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {!isLoading && filteredImages.length === 0 && (
          <div className="text-center py-32 text-gray-500 font-sans text-sm tracking-widest uppercase">
            No {activeMediaType === 'video' ? 'videos' : 'images'} found in this category.
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredImages[lightboxIndex] && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            >
              <button onClick={() => setLightboxIndex(null)} className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl font-light z-50">&times;</button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length); }} 
                className="absolute left-4 md:left-10 text-white/50 hover:text-white text-5xl font-light z-50 p-4"
              >
                &#8249;
              </button>

              <div className="w-full max-w-6xl h-[85vh] p-4 flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
                <motion.img 
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={optimizeCloudinaryUrl(filteredImages[lightboxIndex].url, false)} 
                  alt="Gallery large" 
                  loading="eager"
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % filteredImages.length); }} 
                className="absolute right-4 md:right-10 text-white/50 hover:text-white text-5xl font-light z-50 p-4"
              >
                &#8250;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Gallery;
