import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Phone, Lock, ShieldCheck, CheckCircle2, AlertCircle, Save, Eye, EyeOff, } from 'lucide-react';
import { updateUser } from '../../store';
import { usersApi } from '../../services/api';
import { ProfileCompletion } from '../../components/dashboard/ProfileCompletion';
export const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab');

    useEffect(() => {
        if (tab === 'settings') {
            const el = document.getElementById('settings-card');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [tab]);
    // Profile Form States
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [location, setLocation] = useState(user?.location || '');
    const [education, setEducation] = useState(user?.education || '');
    const [professionalDetails, setProfessionalDetails] = useState(user?.professionalDetails || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [hideContact, setHideContact] = useState(user?.privacySettings?.hideContact || false);
    const [publicProfile, setPublicProfile] = useState(user?.privacySettings?.publicProfile ?? true);
    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // Status / Feedback
    const [profileSuccess, setProfileSuccess] = useState(null);
    const [profileError, setProfileError] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setProfileLoading(true);
        try {
            const res = await usersApi.updateProfile({
                fullName,
                mobile,
                bio,
                location,
                education,
                professionalDetails,
                avatarUrl,
                privacySettings: {
                    hideContact,
                    publicProfile,
                },
            });
            if (res.data.success) {
                dispatch(updateUser(res.data.user));
                setProfileSuccess('Profile successfully updated!');
                setTimeout(() => setProfileSuccess(null), 4000);
            }
        }
        catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile.');
        }
        finally {
            setProfileLoading(false);
        }
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }
        setPasswordLoading(true);
        try {
            const res = await usersApi.changePassword({
                currentPassword,
                newPassword,
            });
            if (res.data.success) {
                setPasswordSuccess('Password successfully changed!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordSuccess(null), 4000);
            }
        }
        catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password.');
        }
        finally {
            setPasswordLoading(false);
        }
    };
    const presetAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    ];
    return (<div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">Profile Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your verified credentials, contact details, account privacy, and security settings
        </p>
      </div>

      {/* Dynamic Profile Completion Tracker */}
      <ProfileCompletion user={user}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Verification Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <img src={avatarUrl || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt={user?.fullName} className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg mx-auto"/>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-navy-950">{user?.fullName}</h3>
              <p className="text-xs text-slate-400 capitalize">{user?.roles?.join(' • ')}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-left space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Choose Avatar Preset:</p>
              <div className="flex items-center justify-center gap-2">
                {presetAvatars.map((av, idx) => (<button key={idx} type="button" onClick={() => setAvatarUrl(av)} className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${avatarUrl === av ? 'border-teal-500 scale-105' : 'border-slate-200 hover:border-slate-300'}`}>
                    <img src={av} alt="avatar" className="w-full h-full object-cover"/>
                  </button>))}
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Account Credentials</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                  18+ Age Eligibility
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600"/>
                  Email Address
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  {user?.isEmailVerified ? 'Verified' : 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-600"/>
                  Mobile Number
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  {user?.isMobileVerified ? 'Verified' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form & Password Change */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Edit Form */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-navy-950">Personal & Professional Information</h3>
              <p className="text-xs text-slate-500">Update your public details and educational background</p>
            </div>

            {profileSuccess && (<div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
                <span>{profileSuccess}</span>
              </div>)}

            {profileError && (<div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>
                <span>{profileError}</span>
              </div>)}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Read Only)</label>
                  <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                  <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                  <input type="text" disabled value={user?.dob || '2000-01-01'} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City / Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, USA" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Education / Institution</label>
                  <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="B.S. in Computer Science" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bio & Professional Headline</label>
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Share a short summary about your professional background, learning interests, or business focus..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>

              {/* Privacy Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Privacy & Visibility</p>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="hideContact" checked={hideContact} onChange={(e) => setHideContact(e.target.checked)} className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"/>
                  <label htmlFor="hideContact" className="text-xs text-slate-700 font-medium">
                    Hide personal mobile number and email from public directory views
                  </label>
                </div>
              </div>

              <button type="submit" disabled={profileLoading} className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
                <Save className="w-4 h-4"/>
                {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div id="settings-card" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-navy-950">Security & Password</h3>
              <p className="text-xs text-slate-500">Update your account password with at least 6 characters</p>
            </div>

            {passwordSuccess && (<div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
                <span>{passwordSuccess}</span>
              </div>)}

            {passwordError && (<div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>
                <span>{passwordError}</span>
              </div>)}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
                <input type={showPassword ? 'text' : 'password'} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                  <input type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                  <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1.5">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>

                <button type="submit" disabled={passwordLoading} className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5"/>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>);
};
