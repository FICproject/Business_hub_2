import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 border border-slate-200">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <LogOut className="w-6 h-6" />}
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-navy-950">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                : 'bg-navy-900 hover:bg-navy-800 shadow-navy-900/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
