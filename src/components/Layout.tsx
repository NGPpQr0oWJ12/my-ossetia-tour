import { Link, Outlet, useLocation } from "react-router-dom";
import { Mountain, Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: "Главная", path: "/" },
    { name: "О компании", path: "/about" },
    { name: "Туры", path: "/tours" },
    { name: "Контакты", path: "/contacts" },
  ];

  const isHome = location.pathname === "/";
  const lightHeader = !isScrolled && isHome;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-stone-200/50 py-3 shadow-lg shadow-black/5" 
            : "bg-transparent py-5"
        )}
      >
        {/* Subtle shadow overlay for text readability on transparent background */}
        {!isScrolled && isHome && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent -z-10 h-24" />
        )}
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group relative z-10">
            <img 
              src="/logo.3fa4429.png" 
              alt="My Ossetia Tours Logo" 
              className={cn(
                "h-10 md:h-12 w-auto transition-all duration-500",
                lightHeader && "brightness-0 invert"
              )} 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-110",
                  lightHeader 
                    ? "text-white/90 hover:text-white" 
                    : "text-stone-800 hover:text-accent-600",
                  location.pathname === link.path && (lightHeader ? "text-white underline underline-offset-8" : "text-accent-600 underline underline-offset-8")
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 relative z-10 transition-transform active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-7 w-7 text-stone-900" />
            ) : (
              <Menu className={cn("h-7 w-7", lightHeader ? "text-white" : "text-stone-900")} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col gap-8 text-center">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "text-3xl font-serif text-stone-900 tracking-tight",
                      location.pathname === link.path && "text-accent-500 italic"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="absolute bottom-12 flex gap-6 text-stone-400">
              <Instagram className="h-6 w-6" />
              <Send className="h-6 w-6" />
              <Facebook className="h-6 w-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Minimal & Full Width */}
      <footer className="bg-stone-950 text-stone-400 py-6 border-t border-stone-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo and Minimal Copy */}
            <div className="flex items-center gap-6">
              <Link to="/">
                <img 
                  src="/logo.3fa4429.png" 
                  alt="My Ossetia Tours Logo" 
                  className="h-6 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" 
                />
              </Link>
              <span className="text-[10px] uppercase tracking-widest text-stone-600 border-l border-stone-800 pl-6 hidden sm:block">
                © {new Date().getFullYear()} My Ossetia Tours
              </span>
            </div>

            {/* Quick Navigation - Single Line */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Social & Contact */}
            <div className="flex items-center gap-8">
              <div className="flex gap-4">
                <a href="#" className="text-stone-500 hover:text-accent-500 transition-colors pointer-events-none"><Instagram className="h-4 w-4" /></a>
                <a href="#" className="text-stone-500 hover:text-accent-500 transition-colors pointer-events-none"><Send className="h-4 w-4" /></a>
              </div>
              <a href="tel:+79991234567" className="text-[11px] font-bold text-white hover:text-accent-500 transition-colors tracking-tighter">
                +7 (999) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
