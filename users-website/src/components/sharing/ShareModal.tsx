import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Twitter, Linkedin, QrCode } from 'lucide-react';
import { sharingApi } from '../../services/api';

interface ShareModalProps {
  targetType: 'product' | 'service' | 'job';
  targetId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  targetType,
  targetId,
  title,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      sharingApi.createShareLink({ targetType, targetId, title })
        .then((res) => {
          if (res.data.success) {
            setShareUrl(res.data.link.fullUrl);
          }
        })
        .catch((err) => {
          // Fallback clean url
          setShareUrl(`${window.location.origin}/share/${targetType}-${targetId.slice(0, 8)}`);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, targetId, targetType, title]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`Check out ${title} on Business Hub!`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title, text: `Check out ${title} on Business Hub`, url: shareUrl });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" /> Share Listing
          </div>
          <h3 className="text-xl font-extrabold text-navy-900">{title}</h3>
          <p className="text-xs text-slate-500">
            Share with partners, colleagues, and social media. Strict seller privacy is preserved.
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase">Shareable Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={loading ? 'Generating clean link...' : shareUrl}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Quick Social Sharing</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={shareWhatsApp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </button>
            <button
              onClick={shareTwitter}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              <Twitter className="w-5 h-5 text-sky-600 mb-1" />
              <span className="text-[10px] font-bold">Twitter</span>
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[10px] font-bold">LinkedIn</span>
            </button>
            <button
              onClick={shareNative}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <Share2 className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-[10px] font-bold">More</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
          🔒 Notice: This link protects seller anonymity and does not expose private owner details or contact channels.
        </div>
      </div>
    </div>
  );
};
