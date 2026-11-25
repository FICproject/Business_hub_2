import React from 'react';
import { X, Download, ShieldCheck, Clock, FileText } from 'lucide-react';

export const DocumentPreviewModal = ({ previewData, onClose, onDownload }) => {
  if (!previewData) return null;

  const isPdf = previewData.mimeType === 'application/pdf' || previewData.originalName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">
                {previewData.requirementName || previewData.originalName}
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="truncate">{previewData.originalName}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Time-Limited Link ({previewData.expiresInSeconds || 120}s)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-900/5 overflow-auto p-4 flex items-center justify-center min-h-[420px]">
          {isPdf ? (
            <iframe
              src={previewData.url}
              title={previewData.originalName}
              className="w-full h-[65vh] rounded-xl border border-slate-200 bg-white"
            />
          ) : (
            <img
              src={previewData.url}
              alt={previewData.originalName}
              className="max-w-full max-h-[68vh] object-contain rounded-xl shadow-md bg-white"
            />
          )}
        </div>

        {/* Footer notice */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Private encrypted access — direct public URLs are disabled for security.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
