import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Settings2, ShieldCheck, RefreshCw } from 'lucide-react';
import { adminApi } from '../../services/api';

export const AdminDocRequirementsModal = ({ onClose }) => {
  const [roleTab, setRoleTab] = useState('teacher');
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: 'mandatory',
    isConditional: false,
    conditionKey: '',
    conditionLabel: '',
    maxSizeMB: 5,
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
  });

  const loadReqs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDocumentRequirements();
      if (res.data?.success) {
        setRequirements(res.data.requirements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReqs();
  }, []);

  const roleReqs = requirements.filter((r) => r.role === roleTab);

  const handleToggleCategory = async (reqItem) => {
    const nextCat = reqItem.category === 'mandatory' ? 'optional' : 'mandatory';
    await adminApi.updateDocumentRequirement(reqItem.id, { category: nextCat });
    loadReqs();
  };

  const handleToggleActive = async (reqItem) => {
    await adminApi.updateDocumentRequirement(reqItem.id, { isActive: !reqItem.isActive });
    loadReqs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this document requirement rule?')) return;
    await adminApi.deleteDocumentRequirement(id);
    loadReqs();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newRule.name.trim()) return;
    await adminApi.createDocumentRequirement({
      ...newRule,
      role: roleTab,
    });
    setShowAdd(false);
    setNewRule({
      name: '',
      description: '',
      category: 'mandatory',
      isConditional: false,
      conditionKey: '',
      conditionLabel: '',
      maxSizeMB: 5,
      allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    });
    loadReqs();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 bg-[#121226] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-extrabold">Configurable Role Document Requirements</h2>
              <p className="text-xs text-slate-300">
                Modify mandatory, optional, and conditional verification documents dynamically without code changes.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-5 bg-[#F8FAFC]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['teacher', 'businessman', 'entrepreneur'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleTab(r)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    roleTab === r ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {r} ({requirements.filter((x) => x.role === r).length})
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdd(!showAdd)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
              <span>Add Document Requirement</span>
            </button>
          </div>

          {showAdd && (
            <form onSubmit={handleCreate} className="bg-white p-4 rounded-2xl border border-indigo-200 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900">New Requirement for "{roleTab}"</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Document Name (e.g. FSSAI License)"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-200"
                />
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="mandatory">Mandatory</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Description / instructions for applicant"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newRule.isConditional}
                    onChange={(e) => setNewRule({ ...newRule, isConditional: e.target.checked })}
                  />
                  Conditional requirement (if applicable / registered)
                </label>
                {newRule.isConditional && (
                  <input
                    type="text"
                    placeholder="conditionKey (e.g. isStartupRegistered)"
                    value={newRule.conditionKey}
                    onChange={(e) => setNewRule({ ...newRule, conditionKey: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg border text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">
                  Save Requirement
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
              Loading rules...
            </div>
          ) : (
            <div className="space-y-2.5">
              {roleReqs.map((r) => (
                <div
                  key={r.id}
                  className={`bg-white p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    r.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-slate-900 text-xs">{r.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          r.category === 'mandatory'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {r.category}
                      </span>
                      {r.isConditional && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Conditional ({r.conditionKey})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Formats: {(r.allowedFormats || []).join(', ').toUpperCase()} • Max {r.maxSizeMB || 5} MB
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleCategory(r)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700"
                    >
                      Switch to {r.category === 'mandatory' ? 'Optional' : 'Mandatory'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(r)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                        r.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
