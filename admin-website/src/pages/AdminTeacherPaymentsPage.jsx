import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, Award, Users, AlertCircle, X } from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminTeacherPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compensation Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [amount, setAmount] = useState('150.00');
  const [notes, setNotes] = useState('Evaluated based on student attendance and session engagement.');

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([
      adminApi.getTeacherPayments(),
      adminApi.getLiveClasses(),
      adminApi.getUsers ? adminApi.getUsers({ role: 'teacher' }) : Promise.resolve({ data: { data: [] } }),
    ])
      .then(([payRes, liveRes, userRes]) => {
        if (payRes.status === 'fulfilled' && payRes.value.data?.success) {
          setPayments(payRes.value.data.data || []);
        }
        if (liveRes.status === 'fulfilled') {
          const classes = liveRes.value.data?.data || liveRes.value.data?.liveClasses || [];
          setLiveClasses(classes);
          if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0]._id);
            setSelectedTeacherId(classes[0].teacherId || classes[0].instructorId || '');
          }
        }
        if (userRes.status === 'fulfilled') {
          setTeachers(userRes.value.data?.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClassSelectionChange = (classId) => {
    setSelectedClassId(classId);
    const targetClass = liveClasses.find((c) => c._id === classId);
    if (targetClass) {
      setSelectedTeacherId(targetClass.teacherId || targetClass.instructorId || '');
    }
  };

  const handleApproveStipend = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedTeacherId || !amount) {
      alert('Please select a live class, teacher, and enter a stipend amount.');
      return;
    }

    try {
      const res = await adminApi.approveTeacherPayment({
        liveClassId: selectedClassId,
        teacherId: selectedTeacherId,
        amount: parseFloat(amount),
        notes: notes.trim(),
      });
      if (res.data?.success) {
        alert('Teacher stipend successfully approved!');
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving compensation');
    }
  };

  const handleMarkPaid = async (paymentId) => {
    const ref = `TXN-STIPEND-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      await adminApi.markPaymentPaid(paymentId, ref);
      alert(`Stipend marked as PAID! Transaction reference: ${ref}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payment');
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const pendingStipends = payments
    .filter((p) => p.status === 'pending' || p.status === 'approved')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const selectedClassObj = liveClasses.find((c) => c._id === selectedClassId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Teacher Compensation & Stipends</h1>
          <p className="text-xs text-slate-400 mt-1">
            Free live classes for students are funded by platform administrator compensation. Admin evaluates each class individually (no automated fixed rate).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <DollarSign className="w-4 h-4" /> Issue Class Stipend
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Settled Stipends (Paid)</p>
          <p className="text-2xl font-black text-emerald-400">${totalPaid.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500">Disbursed to faculty accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Approved / Pending Payout</p>
          <p className="text-2xl font-black text-amber-400">${pendingStipends.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500">Audit approved by Admin</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Completed Classes</p>
          <p className="text-2xl font-black text-teal-400">
            {liveClasses.filter((l) => l.status === 'completed').length}
          </p>
          <p className="text-[11px] text-slate-500">Eligible for stipend evaluation</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Teacher</th>
                <th className="py-3.5 px-4">Live Class</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Stipend Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Admin Audit Notes</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No teacher compensation records issued yet. Click "Issue Class Stipend" to reward completed classes.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-white text-xs">{p.teacherName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {p.teacherId}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-200">{p.classTitle}</td>
                    <td className="py-4 px-4 font-medium text-teal-400">{p.studentAttendanceCount || 0} students</td>
                    <td className="py-4 px-4 font-extrabold text-white text-sm">${(p.amount || 0).toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : p.status === 'approved'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px]">{p.adminNotes || p.notes || 'Admin approved'}</td>
                    <td className="py-4 px-5 text-right">
                      {p.status === 'approved' && (
                        <button
                          onClick={() => handleMarkPaid(p._id)}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] shadow-sm transition-colors"
                        >
                          Execute Payout
                        </button>
                      )}
                      {p.status === 'paid' && (
                        <span className="text-[11px] text-slate-400 font-mono">Ref: {p.transactionReference || p.transactionRef}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Stipend Modal (PRD Section 10) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">Evaluate & Issue Class Stipend</h3>
                <p className="text-xs text-slate-400">
                  Admin decides payment amount individually per live class (no fixed automated rate).
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveStipend} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Select Live Class *</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => handleClassSelectionChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  {liveClasses.map((lc) => (
                    <option key={lc._id} value={lc._id}>
                      {lc.title} ({lc.scheduledDate} • {lc.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedClassObj && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Instructor:</span>
                    <span className="font-bold text-white">{selectedClassObj.teacherName || selectedClassObj.instructorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Attendance:</span>
                    <span className="font-bold text-teal-400">{selectedClassObj.actualAttendanceCount || 0} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Status:</span>
                    <span className="font-bold uppercase text-amber-400">{selectedClassObj.status}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Teacher ID *</label>
                <input
                  type="text"
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                  Admin Evaluated Stipend Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                />
                <p className="text-[10px] text-slate-500">
                  Custom compensation determined by Admin based on class duration, topic complexity, and student attendance.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Admin Audit Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Approve Stipend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminTeacherPaymentsPage;
