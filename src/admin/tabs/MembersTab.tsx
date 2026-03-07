import React, { useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, User } from 'lucide-react';
import { fetchAdminMembersWithStats } from '../../lib/secureData';

type MemberRow = Awaited<ReturnType<typeof fetchAdminMembersWithStats>>[number];

const MembersTab: React.FC = () => {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const rows = await fetchAdminMembersWithStats();
        setMembers(rows);
      } catch (err: any) {
        setError(err?.message || 'Failed to load members.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const summary = useMemo(() => {
    return {
      total: members.length,
      subscribed: members.filter((m) => m.subscriptionActive).length,
      admins: members.filter((m) => m.role === 'admin').length,
    };
  }, [members]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading member records...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Members</div>
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Subscribed</div>
          <div className="text-2xl font-bold text-gray-900">{summary.subscribed}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Admins</div>
          <div className="text-2xl font-bold text-gray-900">{summary.admins}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Member</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Purchases</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Spend</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Login</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Purchase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-sm text-gray-500 text-center">
                  No member records found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{m.fullName || 'Member'}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={12} /> {m.email || 'Hidden'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                      {m.role === 'admin' ? <ShieldCheck size={13} className="text-amber-700" /> : <User size={13} className="text-gray-500" />}
                      <span className={m.role === 'admin' ? 'text-amber-700' : 'text-gray-600'}>
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {m.subscriptionActive ? 'Subscription Active' : 'No Active Subscription'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{m.purchasesCount}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">INR {Math.round(m.totalSpendInr).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {m.lastSignInAt ? new Date(m.lastSignInAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {m.lastPurchaseAt ? new Date(m.lastPurchaseAt).toLocaleString() : 'No purchases'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTab;
