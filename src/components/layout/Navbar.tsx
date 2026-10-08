import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TheRing } from "@/components/prologue/TheRing";
import { navLinks, siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const solid = isScrolled || isMenuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-void/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
        <div className="flex h-16 md:h-[76px] items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <TheRing className="h-7 w-7 transition-[filter] group-hover:brightness-125" />
            <span className="gilded text-[0.95rem] md:text-base font-semibold uppercase tracking-[0.16em]">
              {siteConfig.name}
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const current = location.pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "credit relative block px-3 py-2 text-[0.7rem] transition-colors",
                      current ? "text-gold-bright" : "text-bone-dim hover:text-gold"
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute left-1/2 -bottom-0.5 h-px -translate-x-1/2 bg-fire transition-[width] duration-300",
                        current ? "w-6" : "w-0"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="lg:hidden grid h-10 w-10 place-items-center text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold-dim))]"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <div className={cn("gold-rule transition-opacity duration-300", solid ? "opacity-60" : "opacity-0")} aria-hidden="true" />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="main-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-void/[0.97]"
          >
            <ul className="container mx-auto px-4 py-6 text-center">
              {navLinks.map((link) => {
                const current = location.pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block py-3.5 font-display text-xl uppercase tracking-[0.14em]",
                        current ? "text-gold-bright" : "text-bone-dim"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="gold-rule opacity-60" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
