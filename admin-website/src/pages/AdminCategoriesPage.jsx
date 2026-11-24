import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowUpDown,
  Search,
  RefreshCw,
  X,
  Check,
  Tag,
  Briefcase,
  Boxes,
  HelpCircle,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminCategoriesPage = () => {
  const [activeTab, setActiveTab] = useState('service'); // 'service' | 'material'
  const [serviceCategories, setServiceCategories] = useState([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    type: 'service',
    name: '',
    description: '',
    icon: 'Briefcase',
    order: 0,
    isActive: true,
    subcategoriesStr: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCategories();
      if (res.data?.success) {
        setServiceCategories(res.data.serviceCategories || []);
        setMaterialCategories(res.data.materialCategories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const currentList = activeTab === 'service' ? serviceCategories : materialCategories;
  const filteredList = currentList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      type: activeTab,
      name: '',
      description: '',
      icon: activeTab === 'service' ? 'Briefcase' : 'Boxes',
      order: currentList.length + 1,
      isActive: true,
      subcategoriesStr: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      type: cat.type,
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Briefcase',
      order: cat.order || 0,
      isActive: cat.isActive !== false,
      subcategoriesStr: (cat.subcategories || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setActionLoading(true);
      const subcategories = formData.subcategoriesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        type: formData.type,
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        order: Number(formData.order),
        isActive: formData.isActive,
        subcategories,
      };

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, payload);
        setToast({ type: 'success', text: `Category "${formData.name}" updated successfully!` });
      } else {
        await adminApi.createCategory(payload);
        setToast({ type: 'success', text: `Category "${formData.name}" created successfully!` });
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await adminApi.deleteCategory(cat._id);
      setToast({ type: 'success', text: `Category "${cat.name}" deleted.` });
      fetchCategories();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await adminApi.updateCategory(cat._id, { isActive: !cat.isActive });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
              Database-Driven
            </span>
            <span className="text-xs text-slate-400 font-medium">• Dynamic Category Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Categories & Subcategories
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage Service Categories and Material Categories with subcategories, ordering, and activation status.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two Major Category Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('service')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'service'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Service Categories ({serviceCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('material')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'material'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Material Categories ({materialCategories.length})</span>
        </button>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab} categories...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          onClick={fetchCategories}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Loading categories...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <FolderTree className="w-8 h-8 text-slate-300" />
          <span className="font-semibold text-slate-700">No categories found</span>
          <span>Click "Add New Category" above to create your first category.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((cat) => (
            <div
              key={cat._id}
              className={`bg-white rounded-2xl border p-5 space-y-4 transition-all shadow-xs hover:shadow-md ${
                cat.isActive ? 'border-slate-100' : 'border-slate-200 opacity-75 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                      cat.type === 'material' ? 'bg-amber-600' : 'bg-indigo-600'
                    }`}
                  >
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{cat.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Order: #{cat.order || 0}</span>
                      <span>•</span>
                      <span className="font-mono">{cat._id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                      cat.isActive
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={cat.isActive ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                  >
                    {cat.isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {cat.description || 'No category description provided.'}
              </p>

              {/* Subcategories Pills */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Subcategories ({cat.subcategories?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(cat.subcategories || []).map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                    >
                      {sub}
                    </span>
                  ))}
                  {(!cat.subcategories || cat.subcategories.length === 0) && (
                    <span className="text-slate-400 text-xs italic">No subcategories defined</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  <option value="service">Service Category (Engineering, Architecture, etc.)</option>
                  <option value="material">Material Category (Cement, Steel, Bricks, etc.)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil Engineering or Cement"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of services or materials under this category"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. OPC 53 Grade, PPC, White Cement"
                  value={formData.subcategoriesStr}
                  onChange={(e) => setFormData({ ...formData, subcategoriesStr: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
              >
                {actionLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminCategoriesPage;
