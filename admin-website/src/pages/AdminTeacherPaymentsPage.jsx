import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { adminApi } from '../services/api';
export const AdminTeacherPaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    // New Compensation Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [classId, setClassId] = useState('live-001');
    const [teacherId, setTeacherId] = useState('user-teacher-001');
    const [amount, setAmount] = useState('450.00');
    const [notes, setNotes] = useState('Standard approved stipend for live workshop completion.');
    const loadPayments = () => {
        setLoading(true);
        adminApi.getTeacherPayments()
            .then((res) => {
            if (res.data.success) {
                setPayments(res.data.data);
            }
        })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        loadPayments();
    }, []);
    const handleApproveStipend = async (e) => {
        e.preventDefault();
        try {
            const res = await adminApi.approveTeacherPayment({
                liveClassId: classId,
                teacherId,
                amount: parseFloat(amount),
                notes,
            });
            if (res.data.success) {
                setModalOpen(false);
                loadPayments();
            }
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error approving compensation');
        }
    };
    const handleMarkPaid = async (paymentId) => {
        const ref = `TXN-STIPEND-${Math.floor(100000 + Math.random() * 900000)}`;
        try {
            await adminApi.markPaymentPaid(paymentId, ref);
            loadPayments();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error updating payment');
        }
    };
    return (<div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Teacher Compensation & Stipends</h1>
          <p className="text-xs text-slate-400 mt-1">
            Free live classes for students are funded by platform administrator compensation. Anti-duplicate protected.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5">
          <DollarSign className="w-4 h-4"/> Issue Class Stipend
        </button>
      </div>

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
                <th className="py-3.5 px-4">Approval Notes</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {payments.map((p) => (<tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-bold text-white text-xs">{p.teacherName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {p.teacherId}</p>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-200">{p.classTitle}</td>
                  <td className="py-4 px-4 font-medium text-teal-400">{p.studentAttendanceCount} students</td>
                  <td className="py-4 px-4 font-extrabold text-white text-sm">${p.amount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${p.status === 'paid'
                ? 'bg-emerald-500/20 text-emerald-400'
                : p.status === 'approved'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-500/20 text-amber-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-[11px]">{p.notes || 'N/A'}</td>
                  <td className="py-4 px-5 text-right">
                    {p.status === 'approved' && (<button onClick={() => handleMarkPaid(p._id)} className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] shadow-sm">
                        Execute Payout
                      </button>)}
                    {p.status === 'paid' && (<span className="text-[11px] text-slate-400 font-mono">Ref: {p.transactionRef}</span>)}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Stipend Modal */}
      {modalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-white">Issue Teacher Stipend</h3>
            <p className="text-xs text-slate-400">
              Set administrative compensation for an eligible live classroom session.
            </p>

            <form onSubmit={handleApproveStipend} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Live Class ID</label>
                <input type="text" required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"/>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Teacher ID</label>
                <input type="text" required value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"/>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Stipend Amount ($)</label>
                <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"/>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Approval Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md">
                  Approve Stipend
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
