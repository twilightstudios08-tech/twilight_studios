import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Packages from './pages/Packages';
import Book from './pages/Book';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import LocationPage from './pages/LocationPage';
import AboutUs from './pages/AboutUs';
import Themes from './pages/Themes';
import Contact from './pages/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import ScrollToTopButton from './components/ScrollToTopButton';

// Create a layout component to conditionally hide header/footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll to top on route change & track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: location.pathname });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    } catch (e) {
      console.warn('Analytics tracking error:', e);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col">
      {!isAdmin && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <ScrollToTopButton />}
    </div>
  );
};

function App() {
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    const initAnalytics = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings`);
        const settings = res.data;
        if (settings) {
          if (settings.googleAnalyticsId) {
            // Inject Google Analytics
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
            document.head.appendChild(gaScript);

            const gaInit = document.createElement('script');
            gaInit.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}');
            `;
            document.head.appendChild(gaInit);
          }
          if (settings.metaPixelId) {
            // Inject Meta Pixel
            const pixelScript = document.createElement('script');
            pixelScript.innerHTML = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.metaPixelId}');
            `;
            document.head.appendChild(pixelScript);
          }
        }
      } catch (error) {
        console.error("Failed to load analytics settings", error);
      }
      setAnalyticsInitialized(true);
    };
    initAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/location/:city" element={<LocationPage />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
