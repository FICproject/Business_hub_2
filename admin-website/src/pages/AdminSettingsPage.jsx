import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Settings2 } from 'lucide-react';
import { adminApi } from '../services/api';
import { AdminDocRequirementsModal } from '../components/verification/AdminDocRequirementsModal';
export const AdminSettingsPage = () => {
    const [showDocRulesModal, setShowDocRulesModal] = useState(false);
    const [siteName, setSiteName] = useState('Business Hub');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowNewRegistrations, setAllowNewRegistrations] = useState(true);
    const [emailServiceEnabled, setEmailServiceEnabled] = useState(true);
    const [contactEmail, setContactEmail] = useState('support@businesshub.com');
    const [savedToast, setSavedToast] = useState(false);
    useEffect(() => {
        adminApi.getSettings()
            .then((res) => {
            if (res.data.success && res.data.settings) {
                const s = res.data.settings;
                setSiteName(s.siteName || 'Business Hub');
                setMaintenanceMode(!!s.maintenanceMode);
                setAllowNewRegistrations(s.allowNewRegistrations !== false);
                setEmailServiceEnabled(s.emailServiceEnabled !== false);
                setContactEmail(s.contactEmail || 'support@businesshub.com');
            }
        })
            .catch((err) => console.error(err));
    }, []);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateSettings({
                siteName,
                maintenanceMode,
                allowNewRegistrations,
                emailServiceEnabled,
                contactEmail,
            });
            setSavedToast(true);
            setTimeout(() => setSavedToast(false), 3000);
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error saving settings');
        }
    };
    return (<div className="space-y-6 max-w-4xl mx-auto">
      {savedToast && (<div className="fixed bottom-6 right-6 z-50 bg-teal-500 text-slate-950 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5"/>
          <span>Platform configuration updated successfully!</span>
        </div>)}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Settings & Control</h1>
        <p className="text-xs text-slate-400 mt-1">
          Global SaaS configuration toggles, maintenance states, and operational parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Platform Brand Name</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Customer Support Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"/>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Toggles</h4>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <p className="font-bold text-sm text-white">Maintenance Mode</p>
                <p className="text-xs text-slate-400">Put platform into offline maintenance mode for public users.</p>
              </div>
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="w-5 h-5 rounded text-teal-500"/>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <p className="font-bold text-sm text-white">Allow New Registrations</p>
                <p className="text-xs text-slate-400">Accept new student, teacher, and business signups.</p>
              </div>
              <input type="checkbox" checked={allowNewRegistrations} onChange={(e) => setAllowNewRegistrations(e.target.checked)} className="w-5 h-5 rounded text-teal-500"/>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <p className="font-bold text-sm text-white">Automated OTP & Email Dispatch</p>
                <p className="text-xs text-slate-400">Enable automated email and SMS notification triggers.</p>
              </div>
              <input type="checkbox" checked={emailServiceEnabled} onChange={(e) => setEmailServiceEnabled(e.target.checked)} className="w-5 h-5 rounded text-teal-500"/>
            </div>
          </div>
        </div>

        <button type="submit" className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2">
          <Save className="w-4 h-4"/> Save Configuration
        </button>
      </form>

      {/* Role-Specific Document Requirements Configuration Card */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-teal-400"/>
            Role-Specific Document Verification Requirements
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically add, edit, enable/disable, or configure conditional mandatory documents for Teachers, Businessmen, and Entrepreneurs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDocRulesModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 shadow-md"
        >
          Configure Document Rules
        </button>
      </div>

      {showDocRulesModal && <AdminDocRequirementsModal onClose={() => setShowDocRulesModal(false)} />}
    </div>);
};
