import React from 'react';
import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
export const EmptyState = ({ icon: Icon = Inbox, title, description, actionLabel, actionTo, onAction, }) => {
    return (<div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-4 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-7 h-7 text-slate-400"/>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-extrabold text-navy-950">{title}</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>

      {actionLabel && (actionTo || onAction) && (<div className="pt-2">
          {actionTo ? (<Link to={actionTo} className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all">
              {actionLabel}
            </Link>) : (<button onClick={onAction} className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all">
              {actionLabel}
            </button>)}
        </div>)}
    </div>);
};
