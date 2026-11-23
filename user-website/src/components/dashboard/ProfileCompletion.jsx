import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
export const ProfileCompletion = ({ user, onNavigateToSection, compact = false, }) => {
    const navigate = useNavigate();
    // Dynamic weights calculation based on prompt specifications:
    // - Profile photo: 10%
    // - Personal details: 20%
    // - Contact verification: 20%
    // - Education / Business details: 25%
    // - Additional information: 25%
    const hasPhoto = !!user?.avatarUrl && !user.avatarUrl.includes('dicebear');
    const hasPersonal = !!user?.fullName && !!user?.dob;
    const hasContact = !!user?.email && !!user?.mobile && (user?.isEmailVerified || user?.isMobileVerified);
    const hasEducationOrBusiness = !!user?.education || !!user?.professionalDetails;
    const hasAdditional = !!user?.bio || !!user?.location;
    let totalScore = 0;
    if (hasPhoto)
        totalScore += 10;
    if (hasPersonal)
        totalScore += 20;
    if (hasContact)
        totalScore += 20;
    if (hasEducationOrBusiness)
        totalScore += 25;
    if (hasAdditional)
        totalScore += 25;
    const checklist = [
        {
            id: 'photo',
            label: 'Upload custom profile avatar',
            weight: 10,
            completed: hasPhoto,
        },
        {
            id: 'personal',
            label: 'Personal details & 18+ verified DOB',
            weight: 20,
            completed: hasPersonal,
        },
        {
            id: 'contact',
            label: 'Email & Mobile contact verification',
            weight: 20,
            completed: hasContact,
        },
        {
            id: 'education',
            label: 'Education or Business credentials',
            weight: 25,
            completed: hasEducationOrBusiness,
        },
        {
            id: 'additional',
            label: 'Bio, location & professional headline',
            weight: 25,
            completed: hasAdditional,
        },
    ];
    const handleClickItem = (itemId) => {
        if (onNavigateToSection) {
            onNavigateToSection(itemId);
        }
        else {
            navigate('/dashboard/profile', { state: { targetSection: itemId } });
        }
    };
    if (compact) {
        return (<div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-navy-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500"/>
            Profile Completion
          </span>
          <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{totalScore}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-700" style={{ width: `${totalScore}%` }}/>
        </div>
        <button onClick={() => handleClickItem('personal')} className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
          {totalScore === 100 ? 'View complete profile' : 'Complete missing details'}
          <ArrowRight className="w-3.5 h-3.5"/>
        </button>
      </div>);
    }
    return (<div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Strength</span>
            {totalScore >= 80 && (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600"/>
                Verified Status
              </span>)}
          </div>
          <h3 className="text-xl font-extrabold text-navy-950 mt-0.5">Profile Completion Tracker</h3>
        </div>
        <div className="flex items-baseline gap-1 text-right">
          <span className="text-3xl font-extrabold text-navy-900">{totalScore}%</span>
          <span className="text-xs text-slate-400 font-bold">/ 100%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 transition-all duration-700 shadow-sm" style={{ width: `${totalScore}%` }}/>
        </div>
        <p className="text-[11px] text-slate-500 flex justify-between">
          <span>Click any incomplete item below to navigate directly to it</span>
          <span className="font-semibold text-slate-600">{totalScore === 100 ? 'All steps completed 🎉' : `${100 - totalScore}% remaining`}</span>
        </p>
      </div>

      {/* Interactive Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {checklist.map((item) => (<button key={item.id} type="button" onClick={() => handleClickItem(item.id)} className={`text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${item.completed
                ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                : 'border-slate-200 bg-slate-50/60 hover:bg-amber-50/60 hover:border-amber-300'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {item.completed ? (<CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0"/>) : (<Circle className="w-4 h-4 text-slate-400 flex-shrink-0"/>)}
              <span className={`text-xs font-semibold truncate ${item.completed ? 'text-emerald-900 line-through opacity-80' : 'text-slate-800'}`}>
                {item.label}
              </span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 ${item.completed
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white border border-slate-200 text-slate-600'}`}>
              +{item.weight}%
            </span>
          </button>))}
      </div>
    </div>);
};
