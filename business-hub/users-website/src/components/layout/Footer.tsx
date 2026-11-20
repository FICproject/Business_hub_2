import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl text-white">Business</span>
                <span className="font-extrabold text-2xl text-teal-400">Hub</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Everything Your Business and Career Needs in One Place. Connect with verified businesses, explore high-quality products, enroll in 100% free courses, and discover high-paying jobs.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Strict 18+ Community & Verified Seller Privacy Protected</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/marketplace" className="hover:text-teal-400 transition-colors">All Products</Link></li>
              <li><Link to="/marketplace?category=electronics" className="hover:text-teal-400 transition-colors">Electronics & Tech</Link></li>
              <li><Link to="/marketplace?category=audio" className="hover:text-teal-400 transition-colors">Audio Equipment</Link></li>
              <li><Link to="/marketplace?category=services" className="hover:text-teal-400 transition-colors">Enterprise Services</Link></li>
              <li><Link to="/dashboard/business" className="hover:text-teal-400 transition-colors">Sell on Business Hub</Link></li>
            </ul>
          </div>

          {/* Education & Learning */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Education</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/education" className="hover:text-teal-400 transition-colors">100% Free Courses</Link></li>
              <li><Link to="/education/live-classes" className="hover:text-teal-400 transition-colors">Upcoming Live Classes</Link></li>
              <li><Link to="/education/materials" className="hover:text-teal-400 transition-colors">PDF Notes & Guides</Link></li>
              <li><Link to="/education/tuition" className="hover:text-teal-400 transition-colors">1-on-1 Tuition</Link></li>
              <li><Link to="/register?role=teacher" className="hover:text-teal-400 transition-colors">Become a Teacher</Link></li>
            </ul>
          </div>

          {/* Career & Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Careers & Hub</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-teal-400 transition-colors">Job Opportunities</Link></li>
              <li><Link to="/jobs?category=software" className="hover:text-teal-400 transition-colors">Tech Jobs</Link></li>
              <li><Link to="/register?role=businessman" className="hover:text-teal-400 transition-colors">Business Partner</Link></li>
              <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact Support</a></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Member Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Business Hub SaaS. All rights reserved. Built with modern MERN architecture.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Age Policy (18+)</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
