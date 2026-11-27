import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { quotationsApi } from '../../services/api';

export const RequestQuotationModal = ({
  isOpen,
  onClose,
  item = {},
  type = 'product', // 'product' | 'service'
  onSuccess,
}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(item?.minOrderQty || 1);
  const [unit, setUnit] = useState(item?.unit || (type === 'service' ? 'Service/Job' : 'Units'));
  const [specifications, setSpecifications] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(null);

  if (!isOpen) return null;

  const itemTitle = item?.title || item?.name || 'Selected Listing';
  const itemCategory = item?.category || 'General';
  const itemSubcategory = item?.subcategory || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!location.trim()) {
      setError('Please provide your delivery or service location.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        listingId: item?._id,
        listingType: type,
        title: itemTitle,
        category: itemCategory,
        subcategory: itemSubcategory,
        quantity: parseFloat(quantity) || 1,
        unit,
        specifications,
        location,
        pincode,
        expectedDate,
        budget,
        notes,
      };

      const res = await quotationsApi.submitRequest(payload);
      if (res.data?.success) {
        setSubmittedRequest(res.data.request);
        if (onSuccess) onSuccess(res.data.request);
      } else {
        setError(res.data?.message || 'Failed to submit quotation request.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit quotation request. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    if (user?.roles?.includes('businessman') || user?.roles?.includes('entrepreneur')) {
      navigate('/dashboard/business?tab=quotations');
    } else {
      navigate('/dashboard/user?tab=quotations');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-navy-950">
                {submittedRequest ? 'Quotation Request Confirmed' : 'Request Official Quotation (RFQ)'}
              </h2>
              <p className="text-xs text-slate-500">
                {submittedRequest
                  ? 'Your request has been delivered to Central Admin for company matching'
                  : 'Centralized admin-coordinated quotation workflow with verified businesses'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-navy-950 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success View */}
        {submittedRequest ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-navy-950">Quotation Request Registered!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your request ID is{' '}
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {submittedRequest._id}
                </span>
                . The Central Admin is currently reviewing your specifications and matching eligible verified suppliers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-navy-950">{submittedRequest.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-navy-950">{submittedRequest.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold text-navy-950">
                  {submittedRequest.quantity} {submittedRequest.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-navy-950">{submittedRequest.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <span>Track in My Quotations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Target Item Overview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-indigo-50/60 border border-blue-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">
                    {type === 'service' ? 'Service' : 'Product'}
                  </span>
                  <span className="text-slate-500 text-[11px] font-semibold">{itemCategory}</span>
                </div>
                <h3 className="font-extrabold text-navy-950 text-sm">{itemTitle}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Verified</span>
              </div>
            </div>

            {/* Requester Identity Preview */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
              <div>
                <span className="text-slate-400">Requester: </span>
                <span className="font-bold text-navy-950">{user?.fullName || 'Guest'}</span>
              </div>
              <div>
                <span className="text-slate-400">Account Role: </span>
                <span className="font-bold uppercase text-blue-700">{(user?.roles || [])[0] || 'User'}</span>
              </div>
              <div>
                <span className="text-slate-400">Email: </span>
                <span className="font-bold text-navy-950">{user?.email || 'N/A'}</span>
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Required Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Unit of Measurement *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Units">Units (Pieces)</option>
                  <option value="Bags">Bags (e.g. 50kg)</option>
                  <option value="Tonnes">Tonnes (MT)</option>
                  <option value="Kg">Kilograms (Kg)</option>
                  <option value="Litres">Litres</option>
                  <option value="Meters">Meters (m)</option>
                  <option value="Sq. Ft">Sq. Feet</option>
                  <option value="Hours">Hours</option>
                  <option value="Service/Job">Service / Entire Job</option>
                  <option value="Boxes">Boxes / Cartons</option>
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Required Specifications &amp; Technical Requirements *
              </label>
              <textarea
                rows={3}
                required
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Specify dimensions, grade, material type, tolerance, certifications, or custom branding requirements..."
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Location & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Delivery / Service Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Whitefield, Bengaluru, Karnataka"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560066"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Expected Delivery Date & Budget Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Expected Delivery / Service Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Estimated Budget Range (Optional)
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹50,000 - ₹80,000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Additional Instructions or Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms desired, access restrictions, unloading requirements..."
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
