import React, { useEffect, useState } from 'react';
import { BarChart3, CreditCard, IndianRupee, UserCheck, Users } from 'lucide-react';
import { fetchAdminAnalyticsSnapshot } from '../../lib/secureData';

type Snapshot = Awaited<ReturnType<typeof fetchAdminAnalyticsSnapshot>>;

const AnalyticsTab: React.FC = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAdminAnalyticsSnapshot();
        setSnapshot(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading analytics...</div>;
  }

  if (error || !snapshot) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        {error || 'No analytics data available.'}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: `INR ${Math.round(snapshot.totalRevenueInr).toLocaleString()}`,
      icon: IndianRupee,
    },
    {
      label: 'Total Purchases',
      value: String(snapshot.totalPurchases),
      icon: CreditCard,
    },
    {
      label: 'Paid Purchases',
      value: String(snapshot.paidPurchases),
      icon: BarChart3,
    },
    {
      label: 'Subscribed Members',
      value: String(snapshot.activeSubscribers),
      icon: UserCheck,
    },
    {
      label: 'Total Members',
      value: String(snapshot.totalMembers),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{card.label}</span>
              <card.icon size={14} className="text-amber-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Recent Purchases</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Item</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Type</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {snapshot.recentPurchases.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-sm text-gray-500 text-center">
                  No purchases yet.
                </td>
              </tr>
            ) : (
              snapshot.recentPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">{purchase.item_title}</td>
                  <td className="px-6 py-3 text-xs uppercase tracking-wide font-semibold text-gray-600">{purchase.item_type}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">INR {Math.round(purchase.amount_inr).toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        purchase.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : purchase.payment_status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {purchase.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">{new Date(purchase.purchased_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsTab;
