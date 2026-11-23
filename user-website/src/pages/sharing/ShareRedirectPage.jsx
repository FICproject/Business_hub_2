import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { sharingApi } from '../../services/api';
export const ShareRedirectPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    useEffect(() => {
        if (code) {
            sharingApi.resolveShareLink(code)
                .then((res) => {
                if (res.data.success && res.data.redirectPath) {
                    navigate(res.data.redirectPath, { replace: true });
                }
                else {
                    navigate('/', { replace: true });
                }
            })
                .catch((err) => {
                setError(err.response?.data?.message || 'Invalid or expired share link.');
                setTimeout(() => navigate('/'), 3000);
            });
        }
    }, [code, navigate]);
    return (<div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center animate-bounce">
        <Share2 className="w-7 h-7"/>
      </div>
      <h2 className="text-xl font-extrabold text-navy-900">
        {error ? error : 'Resolving Business Hub Link...'}
      </h2>
      <p className="text-xs text-slate-500 max-w-sm">
        {error ? 'Redirecting to homepage...' : 'Connecting you to the verified listing with full seller privacy protection.'}
      </p>
    </div>);
};
