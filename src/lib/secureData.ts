import { supabase } from './supabaseClient';

export type EntitlementItemType = 'course' | 'ebook' | 'service' | 'package';

export type MemberEntitlement = {
  id: string;
  user_id: string;
  item_type: EntitlementItemType;
  item_key: string;
  item_title: string | null;
  source_purchase_id: string | null;
  granted_at: string;
};

export type MemberPurchase = {
  id: string;
  user_id: string;
  item_type: EntitlementItemType;
  item_key: string;
  item_title: string;
  amount_inr: number;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  purchased_at: string;
  metadata: Record<string, any> | null;
};

export type MemberBooking = {
  id: string;
  user_id: string;
  service_id: string;
  service_title: string;
  service_price_inr: number;
  preferred_date: string;
  preferred_time: string;
  name: string;
  email: string;
  whatsapp: string;
  message: string | null;
  status: 'new' | 'confirmed' | 'done' | 'cancelled';
  created_at: string;
};

export type MemberBiodata = {
  user_id: string;
  full_name: string | null;
  date_of_birth: string | null;
  time_of_birth: string | null;
  place_of_birth: string | null;
  gender: string | null;
  bio: string | null;
  updated_at: string;
};

export type AdminMemberWithStats = {
  userId: string;
  role: string;
  subscriptionActive: boolean;
  fullName: string;
  email: string;
  joinedAt: string;
  lastSignInAt: string | null;
  purchasesCount: number;
  totalSpendInr: number;
  lastPurchaseAt: string | null;
};

export type AdminAnalyticsSnapshot = {
  totalRevenueInr: number;
  totalPurchases: number;
  paidPurchases: number;
  activeSubscribers: number;
  totalMembers: number;
  recentPurchases: MemberPurchase[];
};

const nowIso = () => new Date().toISOString();

const noSupabase = () => !supabase;

const getCurrentUser = async () => {
  if (noSupabase()) return null;
  const { data, error } = await supabase!.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
};

const getRoleForUser = async (userId: string): Promise<'admin' | 'subscriber' | 'public'> => {
  if (noSupabase()) return 'public';
  const { data, error } = await supabase!
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data?.role) return 'subscriber';
  return data.role === 'admin' ? 'admin' : 'subscriber';
};

const requireAdmin = async (): Promise<string> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const role = await getRoleForUser(user.id);
  if (role !== 'admin') throw new Error('Admin access required');
  return user.id;
};

export const fetchMyEntitlements = async (): Promise<MemberEntitlement[]> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) return [];

  const { data, error } = await supabase!
    .from('member_entitlements')
    .select('id, user_id, item_type, item_key, item_title, source_purchase_id, granted_at')
    .eq('user_id', user.id)
    .order('granted_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch entitlements:', error.message);
    return [];
  }

  return (data as MemberEntitlement[]) ?? [];
};

export const fetchMyPurchases = async (): Promise<MemberPurchase[]> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) return [];

  const { data, error } = await supabase!
    .from('member_purchases')
    .select('id, user_id, item_type, item_key, item_title, amount_inr, payment_status, purchased_at, metadata')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch purchases:', error.message);
    return [];
  }

  return (data as MemberPurchase[]) ?? [];
};

export const fetchMyBookings = async (): Promise<MemberBooking[]> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) return [];

  const { data, error } = await supabase!
    .from('member_bookings')
    .select(
      'id, user_id, service_id, service_title, service_price_inr, preferred_date, preferred_time, name, email, whatsapp, message, status, created_at',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch bookings:', error.message);
    return [];
  }

  return (data as MemberBooking[]) ?? [];
};

export const fetchMyBiodata = async (): Promise<MemberBiodata | null> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) return null;

  const { data, error } = await supabase!
    .from('member_biodata')
    .select('user_id, full_name, date_of_birth, time_of_birth, place_of_birth, gender, bio, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch biodata:', error.message);
    return null;
  }

  return (data as MemberBiodata | null) ?? null;
};

export const upsertMyBiodata = async (patch: Partial<MemberBiodata>): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) return false;

  const payload = {
    user_id: user.id,
    full_name: patch.full_name ?? null,
    date_of_birth: patch.date_of_birth ?? null,
    time_of_birth: patch.time_of_birth ?? null,
    place_of_birth: patch.place_of_birth ?? null,
    gender: patch.gender ?? null,
    bio: patch.bio ?? null,
    updated_at: nowIso(),
  };

  const { error } = await supabase!.from('member_biodata').upsert(payload, { onConflict: 'user_id' });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to upsert biodata:', error.message);
    return false;
  }
  return true;
};

export const createServiceBookingAndPurchase = async (input: {
  serviceId: string;
  serviceTitle: string;
  servicePriceInr: number;
  preferredDate: string;
  preferredTime: string;
  name: string;
  email: string;
  whatsapp: string;
  message?: string;
}): Promise<{ ok: boolean; reason?: string }> => {
  const user = await getCurrentUser();
  if (!user || noSupabase()) {
    return { ok: false, reason: 'auth_required' };
  }

  const bookingInsert = {
    user_id: user.id,
    service_id: input.serviceId,
    service_title: input.serviceTitle,
    service_price_inr: input.servicePriceInr,
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    message: input.message ?? null,
    status: 'new',
    created_at: nowIso(),
  };

  const { error: bookingError } = await supabase!.from('member_bookings').insert(bookingInsert);
  if (bookingError) {
    // eslint-disable-next-line no-console
    console.error('Failed to create member booking:', bookingError.message);
    return { ok: false, reason: 'booking_failed' };
  }

  const purchaseInsert = {
    user_id: user.id,
    item_type: 'service',
    item_key: input.serviceId,
    item_title: input.serviceTitle,
    amount_inr: input.servicePriceInr,
    payment_status: 'paid',
    purchased_at: nowIso(),
    metadata: {
      source: 'consultations_form',
      preferred_date: input.preferredDate,
      preferred_time: input.preferredTime,
    },
  };

  const { data: purchaseRows, error: purchaseError } = await supabase!
    .from('member_purchases')
    .insert(purchaseInsert)
    .select('id')
    .limit(1);

  if (purchaseError) {
    // eslint-disable-next-line no-console
    console.error('Failed to create purchase record:', purchaseError.message);
    return { ok: false, reason: 'purchase_failed' };
  }

  const purchaseId = purchaseRows?.[0]?.id ?? null;
  const { error: entitlementError } = await supabase!.from('member_entitlements').upsert(
    {
      user_id: user.id,
      item_type: 'service',
      item_key: input.serviceId,
      item_title: input.serviceTitle,
      source_purchase_id: purchaseId,
      granted_at: nowIso(),
    },
    { onConflict: 'user_id,item_type,item_key' },
  );

  if (entitlementError) {
    // eslint-disable-next-line no-console
    console.error('Failed to grant entitlement:', entitlementError.message);
  }

  return { ok: true };
};

export const fetchAdminMembersWithStats = async (): Promise<AdminMemberWithStats[]> => {
  await requireAdmin();
  if (noSupabase()) return [];

  const [{ data: profiles, error: profilesError }, { data: purchases, error: purchasesError }] = await Promise.all([
    supabase!
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase!
      .from('member_purchases')
      .select('id, user_id, amount_inr, purchased_at, payment_status')
      .order('purchased_at', { ascending: false }),
  ]);

  if (profilesError) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch profiles:', profilesError.message);
    return [];
  }
  if (purchasesError) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch purchases for member stats:', purchasesError.message);
  }

  const purchaseRows = purchases ?? [];
  const grouped = new Map<string, { count: number; spend: number; lastAt: string | null }>();

  purchaseRows.forEach((row: any) => {
    if (!grouped.has(row.user_id)) {
      grouped.set(row.user_id, { count: 0, spend: 0, lastAt: null });
    }
    const curr = grouped.get(row.user_id)!;
    curr.count += 1;
    if (row.payment_status === 'paid') {
      curr.spend += Number(row.amount_inr || 0);
    }
    if (!curr.lastAt || new Date(row.purchased_at) > new Date(curr.lastAt)) {
      curr.lastAt = row.purchased_at;
    }
  });

  return (profiles ?? []).map((p: any) => {
    const stats = grouped.get(p.id) || { count: 0, spend: 0, lastAt: null };
    return {
      userId: p.id,
      role: p.role || 'subscriber',
      subscriptionActive: !!p.subscription_active,
      fullName: p.full_name || p.email?.split('@')?.[0] || 'Member',
      email: p.email || 'Hidden',
      joinedAt: p.created_at || nowIso(),
      lastSignInAt: p.last_sign_in_at || null,
      purchasesCount: stats.count,
      totalSpendInr: stats.spend,
      lastPurchaseAt: stats.lastAt,
    };
  });
};

export const fetchAdminPurchases = async (): Promise<MemberPurchase[]> => {
  await requireAdmin();
  if (noSupabase()) return [];

  const { data, error } = await supabase!
    .from('member_purchases')
    .select('id, user_id, item_type, item_key, item_title, amount_inr, payment_status, purchased_at, metadata')
    .order('purchased_at', { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch admin purchases:', error.message);
    return [];
  }

  return (data as MemberPurchase[]) ?? [];
};

export const fetchAdminAnalyticsSnapshot = async (): Promise<AdminAnalyticsSnapshot> => {
  const [members, purchases] = await Promise.all([fetchAdminMembersWithStats(), fetchAdminPurchases()]);

  const paidPurchases = purchases.filter((p) => p.payment_status === 'paid');
  const totalRevenueInr = paidPurchases.reduce((sum, p) => sum + Number(p.amount_inr || 0), 0);
  const activeSubscribers = members.filter((m) => m.subscriptionActive).length;

  return {
    totalRevenueInr,
    totalPurchases: purchases.length,
    paidPurchases: paidPurchases.length,
    activeSubscribers,
    totalMembers: members.length,
    recentPurchases: purchases.slice(0, 8),
  };
};
