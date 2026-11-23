import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbProps {
  currentPage: string;
  category?: string;
  categoryLink?: string;
  backToLink?: string;
  backToLabel?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPage,
  category = 'Explore',
  categoryLink,
  backToLink = '/',
  backToLabel = 'Back to Home',
}) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-between py-3 mb-6 border-b border-slate-100 text-xs text-slate-500 font-medium">
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <Link to={backToLink} className="flex items-center gap-1 hover:text-[#0A255C] transition-colors font-semibold">
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
        {categoryLink ? (
          <Link to={categoryLink} className="hover:text-[#0A255C] transition-colors">
            {category}
          </Link>
        ) : (
          <span className="text-slate-400">{category}</span>
        )}
        <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
        <span className="font-bold text-[#0A255C]">{currentPage}</span>
      </div>

      <Link
        to={backToLink}
        className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#0A255C] transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        <span>{backToLabel}</span>
      </Link>
    </nav>
  );
};
