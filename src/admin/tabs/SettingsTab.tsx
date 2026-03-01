
import React from 'react';

const SettingsTab: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8">
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Global Site Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Support Email</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="hello@astrokarak.com" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Waitlist Announcement (Home)</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="New Astrology Cohort starting November 15th." />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Currency Conversion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">USD to INR Rate</label>
              <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="90.14" />
            </div>
            <div className="flex items-end">
              <button className="w-full py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Sync Live Rates</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Security</h3>
          <button className="px-6 py-3 border border-amber-700 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-50 transition-all">
            Change Admin Password
          </button>
        </div>

        <div className="flex justify-end pt-8">
          <button className="px-10 py-4 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
