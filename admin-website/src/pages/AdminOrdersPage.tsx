import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, Clock, Truck, ShieldAlert } from 'lucide-react';
import { adminApi } from '../services/api';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    adminApi.getAllOrders()
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Orders & Fulfillment</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor transactions, track customer delivery stages, and handle fulfillment overrides.
        </p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-5 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-teal-400">{o.orderNumber}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-white text-xs">{o.customerName || 'Customer'}</p>
                    <p className="text-[11px] text-slate-500">{o.customerEmail}</p>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-300">{o.items.length} product(s)</td>
                  <td className="py-4 px-4 font-extrabold text-white">${o.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900 text-slate-300 border border-slate-700">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white focus:outline-none"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
