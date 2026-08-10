import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import VideoStory from './components/VideoStory';
import Features from './components/Features';
import Places from './components/Places';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Site = () => {
  const { lang } = useLanguage();

  useEffect(() => {
    // Late-loading images and web fonts change section heights, which would
    // otherwise leave every ScrollTrigger measuring stale positions.
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => window.removeEventListener('load', refresh);
  }, []);

  useEffect(() => {
    // Amharic and English copy differ in length, so switching language
    // reflows the page — re-measure once the new text has painted.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <VideoStory />
        <Features />
        <Places />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Site />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
