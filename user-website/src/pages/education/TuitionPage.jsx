import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { educationApi } from '../../services/api';
export const TuitionPage = () => {
    const [tuitions, setTuitions] = useState([]);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [inquirySuccess, setInquirySuccess] = useState(false);
    useEffect(() => {
        educationApi.getTuitions()
            .then((res) => setTuitions(res.data.data))
            .catch((err) => console.error(err));
    }, []);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
          Personalized Mentoring
        </span>
        <h1 className="text-3xl font-extrabold text-navy-900 mt-2">1-on-1 Tuition & Advisory</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Connect directly with experienced professors and senior industry engineers for personalized coaching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tuitions.map((t) => (<div key={t._id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 uppercase bg-teal-50 px-2.5 py-1 rounded-md">
                  {t.educationLevel}
                </span>
                <span className="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2.5 py-1 rounded-md">
                  {t.format} format
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-navy-900">{t.subject}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
              <div className="text-xs text-slate-500 font-semibold space-y-1">
                <p>Instructor: {t.teacherName || 'Prof. David Vance'}</p>
                <p>Schedule: {t.schedule}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xl font-extrabold text-navy-900">${t.fee}</span>
                <span className="text-xs text-slate-400"> / hr advisory</span>
              </div>
              <button onClick={() => setSelectedTuition(t)} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm">
                Request Tuition
              </button>
            </div>
          </div>))}
      </div>

      {/* Tuition Inquiry Modal */}
      {selectedTuition && (<div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-extrabold text-navy-900">Request Tuition Inquiry</h3>
            <p className="text-xs text-slate-500">
              Submit your inquiry for <span className="font-bold text-slate-800">{selectedTuition.subject}</span> with {selectedTuition.teacherName}.
            </p>

            {inquirySuccess ? (<div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto"/>
                <p className="text-xs font-bold text-slate-800">Inquiry Received!</p>
                <p className="text-[11px] text-slate-600">The teacher will review your request and contact you via your dashboard.</p>
                <button onClick={() => {
                    setSelectedTuition(null);
                    setInquirySuccess(false);
                }} className="mt-2 px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold">
                  Close
                </button>
              </div>) : (<div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Learning Goal</label>
                  <textarea rows={3} placeholder="Describe your current level and targets..." className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setInquirySuccess(true)} className="flex-grow py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md">
                    Send Request
                  </button>
                  <button onClick={() => setSelectedTuition(null)} className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    Cancel
                  </button>
                </div>
              </div>)}
          </div>
        </div>)}
    </div>);
};
