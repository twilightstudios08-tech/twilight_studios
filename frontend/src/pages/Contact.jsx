import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/inquiries`, formData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('There was an error sending your message. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="font-oswald font-bold text-4xl text-white uppercase tracking-widest mb-6">Message Sent</h2>
          <p className="font-sans text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to Twilight Studios. We will get back to you shortly.
          </p>
          <button 
            onClick={() => {
              setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
              setSubmitted(false);
            }} 
            className="mt-8 px-8 py-4 border border-white/20 text-white font-sans text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-oswald font-bold text-5xl md:text-6xl text-white uppercase tracking-widest mb-4">Contact Us</h1>
          <p className="font-sans text-gray-400 text-sm tracking-[0.2em] uppercase">Get in touch with Twilight Studios</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Your Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans resize-none"
              ></textarea>
            </div>

            <div className="pt-4 text-center">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-white text-black font-oswald text-sm font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
