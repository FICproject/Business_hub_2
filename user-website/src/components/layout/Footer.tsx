import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#070D1E] text-slate-300 pt-16 pb-12 overflow-hidden border-t border-slate-900">
      {/* Decorative Golden Accent Waves */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-l from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-40 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md shadow-amber-500/20">
              B
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl text-white">Business</span>
                <span className="font-extrabold text-xl text-white">Hub</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Shop • Learn • Grow</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
            <Link to="/#about" className="hover:text-amber-400 transition-colors">About Us</Link>
            <span className="text-slate-700">|</span>
            <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link>
            <span className="text-slate-700">|</span>
            <Link to="/#contact" className="hover:text-amber-400 transition-colors">Help & Support</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-sm"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-xs text-slate-500">
          <p>© 2026 Business Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
