import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [contact, setContact] = useState({
    email: 'hello@twilightstudios.com',
    phone: '+1 (555) 019-2834'
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings`)
      .then(res => {
        if (res.data) {
          setContact({
            email: res.data.contactEmail || 'hello@twilightstudios.com',
            phone: res.data.whatsappNumber || '+1 (555) 019-2834'
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-black text-white relative overflow-hidden pt-32 pb-12 border-t border-white/5">
      
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-oswald font-bold text-white/5 whitespace-nowrap select-none pointer-events-none z-0 tracking-widest">
        TWILIGHT
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">

        {/* Footer Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 w-full mb-24 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-oswald text-2xl uppercase tracking-[0.3em] mb-6">Studio</h3>
            <p className="text-xs font-sans text-gray-400 tracking-widest leading-relaxed">
              123 Cinematic Way<br/>
              Aesthetic District<br/>
              New York, NY 10012
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-oswald text-2xl uppercase tracking-[0.3em] mb-6">Locations</h3>
            <div className="flex flex-col gap-3">
              {['Srikakulam', 'Vizag', 'Vizianagaram'].map(city => (
                <Link key={city} to={`/location/${city.toLowerCase()}`} className="text-xs font-sans text-gray-400 tracking-[0.2em] uppercase hover:text-white transition-colors">
                  {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-oswald text-2xl uppercase tracking-[0.3em] mb-6">Inquiries</h3>
            <p className="text-xs font-sans text-gray-400 tracking-widest leading-relaxed">
              <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a><br/>
              <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{contact.phone}</a>
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-oswald text-2xl uppercase tracking-[0.3em] mb-6">Socials</h3>
            <div className="flex flex-col gap-3">
              {['Instagram', 'Facebook', 'Pinterest'].map(social => (
                <a key={social} href="#" className="text-xs font-sans text-gray-400 tracking-[0.2em] uppercase hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-[10px] font-sans text-gray-600 uppercase tracking-[0.3em] mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Twilight Studios. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-sans text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-sans text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
