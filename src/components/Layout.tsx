import { Link, Outlet, useLocation } from "react-router-dom";
import { Mountain, Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
const logoImage = "/logo.3fa4429.png";

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
                src={logoImage} 
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
                      location.pathname === link.path && "text-accent-500"
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
      {/* Footer */}
      <footer className="relative overflow-hidden bg-stone-950 text-stone-300 border-t border-stone-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.14),transparent_45%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr]">
            <div>
              <Link to="/" className="inline-flex items-center mb-5">
                <img
                  src={logoImage}
                  alt="My Ossetia Tours Logo"
                  className="h-8 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="max-w-md text-sm leading-relaxed text-stone-400 mb-6">
                Авторские маршруты по Северной Осетии с локальными гидами: горы, история,
                гастрономия и безопасные поездки в небольших группах.
              </p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-white hover:text-accent-500 transition-colors"
              >
                Подобрать тур
                <Mountain className="h-4 w-4" />
              </Link>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 mb-4">Навигация</h3>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "w-fit text-sm transition-colors",
                      location.pathname === link.path ? "text-accent-500" : "text-stone-300 hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 mb-4">Контакты</h3>
              <div className="space-y-3 text-sm">
                <a href="tel:+79991234567" className="flex items-center gap-3 text-stone-300 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-accent-500" />
                  +7 (999) 123-45-67
                </a>
                <a href="mailto:hello@myossetia.tours" className="flex items-center gap-3 text-stone-300 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-accent-500" />
                  hello@myossetia.tours
                </a>
                <div className="flex items-center gap-3 text-stone-300">
                  <MapPin className="h-4 w-4 text-accent-500" />
                  Владикавказ, Республика Северная Осетия
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-accent-500/60 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-accent-500/60 transition-colors">
                  <Send className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:border-accent-500/60 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs tracking-wide text-stone-500">
            <p>© {new Date().getFullYear()} My Ossetia Tours. Все права защищены.</p>
            <p>Сделано с любовью к Кавказу.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}




