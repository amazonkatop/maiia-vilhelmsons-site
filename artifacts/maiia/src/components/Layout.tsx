import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLocale } from '../contexts/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { locale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on the homepage hero to determine if nav should be transparent initially
  const isHome = location === '/en' || location === '/ru' || location === '/en/' || location === '/ru/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    const newPath = location.replace(/^\/(en|ru)/, `/${newLocale}`);
    setLocation(newPath || `/${newLocale}`);
  };

  const navLinks = [
    { href: `/${locale}/portfolio`, label: t('nav.portfolio') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/journal`, label: t('nav.journal') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  const headerBgClass = isHome && !scrolled && !mobileMenuOpen
    ? 'bg-transparent text-white'
    : 'bg-background/95 backdrop-blur-md border-b text-foreground';

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${headerBgClass}`}>
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-serif text-2xl tracking-[0.2em] uppercase z-50 relative group">
            <span className="group-hover:opacity-70 transition-opacity duration-500">Maiia Vilhelmsons</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm uppercase tracking-widest hover:text-accent transition-colors duration-300">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-8">
            <a href="tel:+19296001851" className="text-sm font-medium hover:text-accent transition-colors duration-300">
              +1 929 600 1851
            </a>
            <button 
              onClick={toggleLocale}
              className="text-sm font-medium hover:text-accent transition-colors duration-300 uppercase tracking-widest"
            >
              {locale === 'en' ? 'RU' : 'EN'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 flex flex-col"
          >
            <nav className="flex flex-col gap-8 mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  key={link.href}
                >
                  <Link href={link.href} className="text-3xl font-serif tracking-wide hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-auto mb-12 flex flex-col gap-6"
            >
              <a href="tel:+19296001851" className="text-xl font-serif">
                +1 929 600 1851
              </a>
              <button 
                onClick={toggleLocale}
                className="text-lg w-fit hover:text-accent transition-colors uppercase tracking-widest"
              >
                Switch to {locale === 'en' ? 'Russian' : 'English'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="bg-foreground text-white py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <h3 className="font-serif text-2xl tracking-widest uppercase mb-6">Maiia Vilhelmsons</h3>
            <p className="text-white/60 font-light max-w-xs leading-relaxed">
              {locale === 'en' 
                ? 'An exclusive interior design studio crafting timeless spaces in the Hamptons and Manhattan.'
                : 'Эксклюзивная студия дизайна интерьера, создающая вневременные пространства в Хэмптонс и на Манхэттене.'}
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg tracking-wider mb-6">Studio</h4>
            <div className="flex flex-col gap-3 text-white/60 font-light">
              <p>Southampton, NY</p>
              <p>Manhattan, NY</p>
              <a href="mailto:studio@maiiavilhelmsons.com" className="hover:text-accent transition-colors w-fit">
                studio@maiiavilhelmsons.com
              </a>
              <a href="tel:+19296001851" className="hover:text-accent transition-colors w-fit">
                +1 929 600 1851
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-serif text-lg tracking-wider mb-6">Social</h4>
            <div className="flex flex-col gap-3 text-white/60 font-light">
              <a href="https://www.instagram.com/mvlh_interiors/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors w-fit">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors w-fit">Pinterest</a>
              <a href="#" className="hover:text-accent transition-colors w-fit">Architectural Digest</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-white/10 text-white/40 text-sm font-light flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Maiia Vilhelmsons. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">Privacy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}