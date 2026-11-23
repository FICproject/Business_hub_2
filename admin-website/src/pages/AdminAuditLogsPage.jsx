import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '../services/api';
export const AdminAuditLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        adminApi.getAuditLogs()
            .then((res) => {
            if (res.data.success) {
                setLogs(res.data.data);
            }
        })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    const filteredLogs = logs.filter((l) => l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.actorName.toLowerCase().includes(search.toLowerCase()) ||
        l.details.toLowerCase().includes(search.toLowerCase()) ||
        l.entityType.toLowerCase().includes(search.toLowerCase()));
    return (<div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Security & Audit Logs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable chronological ledger recording all critical administrative and authentication operations.
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit trail..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"/>
        </div>
        <span className="text-xs font-bold text-teal-400">{filteredLogs.length} Events Recorded</span>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-5">Operational Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => (<tr key={log._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900 text-teal-400 border border-teal-800/60">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-white">
                    {log.actorName} <span className="text-[10px] text-slate-500 font-normal">({log.actorRole})</span>
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-medium">{log.entityType}</td>
                  <td className="py-4 px-5 text-slate-400 text-xs max-w-sm">{log.details}</td>
                  <td className="py-4 px-4 text-right font-mono text-[11px] text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
