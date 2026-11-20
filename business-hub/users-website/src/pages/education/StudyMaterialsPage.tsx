import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, CheckCircle2, BookOpen } from 'lucide-react';
import { educationApi } from '../../services/api';
import { IStudyMaterial } from '../../types';

export const StudyMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<IStudyMaterial[]>([]);
  const [search, setSearch] = useState('');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  useEffect(() => {
    educationApi.getMaterials()
      .then((res) => setMaterials(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDownload = (mat: IStudyMaterial) => {
    setDownloadToast(`Downloading "${mat.title}" (${mat.fileSize})...`);
    window.open(mat.fileUrl, '_blank');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const filtered = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-200" />
          <span>{downloadToast}</span>
        </div>
      )}

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
          Downloadable Curricula
        </span>
        <h1 className="text-3xl font-extrabold text-navy-900 mt-2">PDF Notes & Study Materials</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verified academic cheat-sheets, system design guides, and legal templates curated by instructors.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter notes by subject or topic..."
          className="w-full text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((mat) => (
          <div
            key={mat._id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-teal-600 uppercase bg-teal-50 px-2 py-0.5 rounded-md">
                  {mat.subject} • {mat.topic}
                </span>
                <h3 className="font-bold text-lg text-navy-900">{mat.title}</h3>
                <p className="text-xs text-slate-400">
                  Curated by {mat.authorName || 'Verified Instructor'} • {mat.fileSize} • {mat.fileType}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {mat.downloadsCount || 80}+ Downloads
              </span>
              <button
                onClick={() => handleDownload(mat)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF Free
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
