import React from 'react';
export const StatCard = ({ label, value, subtext, icon: Icon, badge, badgeColor = 'teal', onClick, }) => {
    const badgeClasses = {
        teal: 'bg-teal-50 text-teal-700 border-teal-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        rose: 'bg-rose-50 text-rose-700 border-rose-200',
    }[badgeColor];
    return (<div onClick={onClick} className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : ''}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
          {label}
        </span>
        {Icon && (<div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shadow-inner">
            <Icon className="w-5 h-5 text-navy-800"/>
          </div>)}
      </div>

      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">{value}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          {subtext && <p className="text-xs font-semibold text-slate-500 truncate">{subtext}</p>}
          {badge && (<span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeClasses} whitespace-nowrap`}>
              {badge}
            </span>)}
        </div>
      </div>
    </div>);
};
