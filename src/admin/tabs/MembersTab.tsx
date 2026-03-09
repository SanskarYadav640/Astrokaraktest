import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, ShieldCheck, Trash2, User } from 'lucide-react';
import {
  adminAddMemberByEmail,
  adminRemoveMember,
  adminUpdateMember,
  fetchAdminMembersWithStats,
} from '../../lib/secureData';

type MemberRow = Awaited<ReturnType<typeof fetchAdminMembersWithStats>>[number];

type NewMemberForm = {
  email: string;
  fullName: string;
  subscriptionActive: boolean;
};

type EditMemberForm = {
  email: string;
  fullName: string;
  subscriptionActive: boolean;
};

const MembersTab: React.FC = () => {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<NewMemberForm>({
    email: '',
    fullName: '',
    subscriptionActive: true,
  });
  const [editDraft, setEditDraft] = useState<EditMemberForm>({
    email: '',
    fullName: '',
    subscriptionActive: false,
  });

  const loadMembers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const summary = useMemo(() => {
    return {
      total: members.length,
      subscribed: members.filter((m) => m.subscriptionActive).length,
      admins: members.filter((m) => m.role === 'admin').length,
    };
  }, [members]);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleAddMember = async () => {
    const email = newMember.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address to add a member.');
      return;
    }

    setError('');
    setNotice('');
    setSaving(true);
    try {
      await adminAddMemberByEmail({
        email,
        fullName: newMember.fullName,
        subscriptionActive: newMember.subscriptionActive,
      });
      setNewMember({
        email: '',
        fullName: '',
        subscriptionActive: true,
      });
      setNotice('Member added successfully.');
      await loadMembers();
    } catch (err: any) {
      setError(err?.message || 'Failed to add member.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (member: MemberRow) => {
    if (member.role === 'admin') return;
    setError('');
    setNotice('');
    setEditingUserId(member.userId);
    setEditDraft({
      email: member.email || '',
      fullName: member.fullName || '',
      subscriptionActive: !!member.subscriptionActive,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditDraft({
      email: '',
      fullName: '',
      subscriptionActive: false,
    });
  };

  const handleSaveMember = async () => {
    if (!editingUserId) return;
    const email = editDraft.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError('Enter a valid email before saving.');
      return;
    }

    setError('');
    setNotice('');
    setSaving(true);
    try {
      await adminUpdateMember({
        userId: editingUserId,
        email,
        fullName: editDraft.fullName,
        subscriptionActive: editDraft.subscriptionActive,
      });
      setNotice('Member updated successfully.');
      cancelEdit();
      await loadMembers();
    } catch (err: any) {
      setError(err?.message || 'Failed to update member.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (member: MemberRow) => {
    if (member.role === 'admin') return;

    const shouldDelete = window.confirm(`Remove member "${member.email}" from member management?`);
    if (!shouldDelete) return;

    setError('');
    setNotice('');
    setDeletingUserId(member.userId);
    try {
      await adminRemoveMember(member.userId);
      setNotice('Member removed successfully.');
      if (editingUserId === member.userId) {
        cancelEdit();
      }
      await loadMembers();
    } catch (err: any) {
      setError(err?.message || 'Failed to remove member.');
    } finally {
      setDeletingUserId(null);
    }
  };

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
      {notice ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{notice}</div>
      ) : null}

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

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Add Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="member@email.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={newMember.fullName}
            onChange={(e) => setNewMember((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full name (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={newMember.subscriptionActive}
              onChange={(e) => setNewMember((prev) => ({ ...prev, subscriptionActive: e.target.checked }))}
              className="h-4 w-4"
            />
            Subscription active
          </label>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddMember}
            disabled={saving}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Member'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Member email must already exist in Supabase Auth (user must have signed up at least once).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Member</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Subscription</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Purchases</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Spend</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Login</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Purchase</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-sm text-gray-500 text-center">
                  No member records found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.userId} className="hover:bg-gray-50 transition-colors align-top">
                  <td className="px-6 py-4">
                    {editingUserId === m.userId ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editDraft.fullName}
                          onChange={(e) => setEditDraft((prev) => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                        <input
                          type="email"
                          value={editDraft.email}
                          onChange={(e) => setEditDraft((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-bold text-gray-900">{m.fullName || 'Member'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={12} /> {m.email || 'Hidden'}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                      {m.role === 'admin' ? <ShieldCheck size={13} className="text-amber-700" /> : <User size={13} className="text-gray-500" />}
                      <span className={m.role === 'admin' ? 'text-amber-700' : 'text-gray-600'}>
                        {m.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {editingUserId === m.userId ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editDraft.subscriptionActive}
                          onChange={(e) => setEditDraft((prev) => ({ ...prev, subscriptionActive: e.target.checked }))}
                          className="h-4 w-4"
                        />
                        Subscription active
                      </label>
                    ) : m.subscriptionActive ? (
                      <span className="font-semibold text-emerald-700">Active</span>
                    ) : (
                      <span className="font-semibold text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{m.purchasesCount}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">INR {Math.round(m.totalSpendInr).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {m.lastSignInAt ? new Date(m.lastSignInAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {m.lastPurchaseAt ? new Date(m.lastPurchaseAt).toLocaleString() : 'No purchases'}
                  </td>
                  <td className="px-6 py-4">
                    {m.role === 'admin' ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Admin Locked</span>
                    ) : editingUserId === m.userId ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveMember}
                          disabled={saving}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(m)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveMember(m)}
                          disabled={deletingUserId === m.userId}
                          className="px-3 py-1.5 bg-red-50 text-red-700 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-100 disabled:opacity-60 inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    )}
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
