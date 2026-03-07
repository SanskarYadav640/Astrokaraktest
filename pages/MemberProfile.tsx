
import React, { useEffect, useMemo, useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Calendar, 
  MessageSquare, 
  Bookmark, 
  PlayCircle, 
  FileText, 
  ChevronRight,
  User,
  LogOut,
  Clock,
  Settings,
  Mail,
  Camera,
  Check,
  ShoppingBag,
  ArrowUpRight,
  Lock,
  Sparkles,
  Trophy,
  ArrowRight,
  Users,
  ShieldCheck
} from 'lucide-react';
import { MOCK_MEMBER_DATA, ALL_COURSES, EBOOKS } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyBiodata,
  fetchMyBookings,
  fetchMyEntitlements,
  upsertMyBiodata,
  type MemberBooking,
  type MemberEntitlement,
} from '../src/lib/secureData';

const MemberProfile: React.FC = () => {
  const { user, isLoggedIn, loginWithGoogle, loginWithEmail, signupWithEmail, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'bookings' | 'dm' | 'saved' | 'settings'>('content');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [entitlements, setEntitlements] = useState<MemberEntitlement[]>([]);
  const [myBookings, setMyBookings] = useState<MemberBooking[]>([]);
  const [memberDataLoading, setMemberDataLoading] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileBio, setProfileBio] = useState(user?.bio || 'Student of technical Jyotish.');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState('');

  // Logic to find owned vs unowned
  const fallbackOwnedCourseIds = useMemo(() => MOCK_MEMBER_DATA.courses.map(c => c.id), []);
  const fallbackOwnedEbookIds = useMemo(() => MOCK_MEMBER_DATA.ebooks.map(e => e.id), []);

  const entOwnedCourseIds = useMemo(
    () => entitlements.filter(e => e.item_type === 'course').map(e => e.item_key),
    [entitlements],
  );
  const entOwnedEbookIds = useMemo(
    () => entitlements.filter(e => e.item_type === 'ebook').map(e => e.item_key),
    [entitlements],
  );

  const ownedCourseIds = entOwnedCourseIds.length > 0 ? entOwnedCourseIds : fallbackOwnedCourseIds;
  const ownedEbookIds = entOwnedEbookIds.length > 0 ? entOwnedEbookIds : fallbackOwnedEbookIds;
  const ownedCourses = ALL_COURSES.filter(c => ownedCourseIds.includes(c.id));
  const ownedEbooks = EBOOKS.filter(e => ownedEbookIds.includes(e.id));
  const consultationHistory = myBookings.length > 0
    ? myBookings.map(b => ({
        id: b.id,
        service: b.service_title,
        date: `${b.preferred_date} ${b.preferred_time}`,
        status:
          b.status === 'done' ? 'Completed'
          : b.status === 'confirmed' ? 'Upcoming'
          : b.status === 'cancelled' ? 'Cancelled'
          : 'New Request',
        recordingUrl: null as string | null,
      }))
    : MOCK_MEMBER_DATA.consultations;

  const unownedCourses = useMemo(() => 
    ALL_COURSES.filter(c => !ownedCourseIds.includes(c.id)), 
  [ownedCourseIds]);

  const unownedEbooks = useMemo(() => 
    EBOOKS.filter(e => !ownedEbookIds.includes(e.id)), 
  [ownedEbookIds]);

  useEffect(() => {
    if (!isLoggedIn) return;
    setProfileName(user?.name || '');
    setProfileBio(user?.bio || 'Student of technical Jyotish.');
  }, [isLoggedIn, user?.name, user?.bio]);

  useEffect(() => {
    if (!isLoggedIn) {
      setEntitlements([]);
      setMyBookings([]);
      return;
    }

    const loadMemberData = async () => {
      setMemberDataLoading(true);
      const [ents, bookings, biodata] = await Promise.all([
        fetchMyEntitlements(),
        fetchMyBookings(),
        fetchMyBiodata(),
      ]);
      setEntitlements(ents);
      setMyBookings(bookings);
      if (biodata?.full_name) setProfileName(biodata.full_name);
      if (biodata?.bio) setProfileBio(biodata.bio);
      if (biodata?.date_of_birth) setBirthDate(biodata.date_of_birth);
      if (biodata?.time_of_birth) setBirthTime(biodata.time_of_birth);
      if (biodata?.place_of_birth) setBirthPlace(biodata.place_of_birth);
      if (biodata?.gender) setGender(biodata.gender);
      setMemberDataLoading(false);
    };

    void loadMemberData();
  }, [isLoggedIn]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    updateProfile({ name: profileName, bio: profileBio });
    await upsertMyBiodata({
      full_name: profileName,
      bio: profileBio,
      date_of_birth: birthDate || null,
      time_of_birth: birthTime || null,
      place_of_birth: birthPlace || null,
      gender: gender || null,
    });

    setIsUpdating(false);
    setActiveTab('content');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (authMode === 'signup') {
      await signupWithEmail(email, password, authName);
      return;
    }
    await loginWithEmail(email, password);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Member Portal</h1>
            <p className="text-sm text-gray-500">
              {authMode === 'signup'
                ? 'Create your account to access your learning archive and dashboard.'
                : 'Sign in to access your learning archive and dashboard.'}
            </p>
          </div>
          <div className="mb-6 p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold uppercase tracking-widest">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`py-2 rounded-lg transition-all ${authMode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={handleEmailAuth} className="space-y-6 mb-6">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required={authMode === 'signup'}
                  placeholder="Your full name"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg uppercase tracking-widest text-xs"
            >
              {authMode === 'signup' ? 'Create Account' : 'Sign In with Email'}
            </button>
          </form>
          <button
            onClick={loginWithGoogle}
            className="w-full py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:border-amber-700 hover:text-amber-700 transition-all shadow-sm uppercase tracking-widest text-[11px] flex items-center justify-center space-x-3"
          >
            <span>Continue with Google</span>
          </button>
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">New student? <Link to="/courses" className="text-amber-700 font-bold hover:underline">Enroll in a course</Link> to get access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] animate-fade-in">
      {/* Header */}
      <div className={`border-b transition-colors duration-500 pb-12 pt-8 ${user?.tier === 'Student' ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 shadow-xl relative ${user?.tier === 'Student' ? 'border-amber-700/30 bg-gray-800' : 'border-white bg-amber-50'}`}>
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
                {user?.tier === 'Student' && (
                  <div className="absolute top-2 right-2 bg-amber-700 text-white p-1 rounded-lg shadow-lg">
                    <Trophy size={14} />
                  </div>
                )}
              </div>
              <button 
                onClick={() => setActiveTab('settings')}
                className="absolute -bottom-2 -right-2 bg-amber-700 text-white p-2.5 rounded-xl shadow-lg hover:bg-amber-800 transition-all"
              >
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className={`text-3xl md:text-4xl font-serif font-bold ${user?.tier === 'Student' ? 'text-white' : 'text-gray-900'}`}>{user?.name}</h1>
                {user?.tier === 'Student' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-700/20 text-amber-500 border border-amber-700/30 uppercase tracking-widest w-fit mx-auto md:mx-0">
                    <Sparkles size={10} className="mr-1" /> Verified Student
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                <span className="flex items-center text-gray-500"><Clock size={14} className="mr-1.5 text-amber-700" /> Joined {user?.joinDate}</span>
                <span className="flex items-center text-gray-500"><Mail size={14} className="mr-1.5 text-amber-700" /> {user?.email}</span>
              </div>
              {user?.bio && <p className="text-sm text-gray-500 mt-2 italic">"{user.bio}"</p>}
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setActiveTab('settings')} className="px-6 py-2.5 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-amber-800 transition-all shadow-md">
                Hub Settings
              </button>
              <button onClick={logout} className={`p-2.5 border rounded-full transition-all ${user?.tier === 'Student' ? 'bg-white/5 border-white/10 text-white hover:text-red-400' : 'bg-white border-gray-200 text-gray-400 hover:text-red-600'}`}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`sticky top-[64px] z-40 border-b overflow-x-auto transition-colors duration-500 ${user?.tier === 'Student' ? 'bg-[#121212] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'content', label: 'My Research', icon: BookOpen },
              { id: 'bookings', label: 'Consultations', icon: Calendar },
              { id: 'dm', label: 'Priority DMs', icon: MessageSquare },
              { id: 'saved', label: 'Saved Archive', icon: Bookmark },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 flex items-center space-x-2 border-b-2 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'border-amber-700 text-amber-700' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {memberDataLoading && (
          <div className="mb-6 text-xs text-gray-500">Syncing your purchases and access rights...</div>
        )}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in">
            <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-8">Account Configuration</h2>
            <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Bio / Study Focus</label>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date of Birth</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Time of Birth</label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Place of Birth</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="City, State, Country"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gender</label>
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  disabled={isUpdating}
                  className="w-full py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center space-x-2"
                >
                  {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Check size={16} />}
                  <span>{isUpdating ? 'Updating...' : 'Save Configuration'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-20 animate-fade-in">
            
            {/* Student Only Community Entry */}
            {user?.tier === 'Student' && (
              <section className="bg-amber-700 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                      <Users size={12} className="mr-2" /> Elite Student Lab
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Private Research Laboratory</h2>
                    <p className="text-white/80 text-sm leading-relaxed mb-8">
                      You have full access to the student community. Discuss D-charts, upload anonymized technical studies, and interact with the Astrokarak research team in real-time.
                    </p>
                    <Link to="/community" className="inline-flex items-center px-10 py-4 bg-white text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-50 transition-all shadow-xl">
                      Enter Laboratory <ArrowRight size={14} className="ml-2" />
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-48 h-48 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ShieldCheck size={80} className="text-white/40" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Academy Programs Section */}
            <section>
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-3">Professional Academy</h2>
                  <h3 className="text-3xl font-serif font-bold text-gray-900">Active Programs</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Owned Courses */}
                {ownedCourses.map((course) => (
                  <div key={course.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:border-amber-200 transition-all">
                    <div className="relative aspect-video">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="text-white w-12 h-12" />
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{course.title}</h3>
                      <button className="w-full py-3.5 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-amber-700 group-hover:text-white transition-all flex items-center justify-center space-x-2">
                        <span>Enter Classroom</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Available Programs (Placeholders) */}
                {unownedCourses.map((course) => (
                  <div key={course.id} className="group bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col justify-center items-center text-center space-y-6 hover:bg-white hover:border-amber-100 transition-all">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-amber-700 group-hover:bg-amber-50 transition-all">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-gray-400 group-hover:text-gray-900 transition-all">{course.title}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Available for Enrollment</p>
                    </div>
                    <Link 
                      to="/courses"
                      className="px-8 py-3 bg-white border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-amber-700 hover:text-amber-700 transition-all flex items-center space-x-2"
                    >
                      <span>Buy a Course</span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Archive (Ebooks) Section */}
            <section>
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-3">Research Archive</h2>
                  <h3 className="text-3xl font-serif font-bold text-gray-900">Digital Library</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Owned Ebooks */}
                {ownedEbooks.map((ebook) => (
                  <div key={ebook.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:border-amber-200 transition-all">
                    <div className="relative aspect-[3/4]">
                      <img src={ebook.image} alt={ebook.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl">
                          <Download className="text-amber-700" size={20} />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 line-clamp-1">{ebook.title}</h3>
                      <button className="w-full py-2.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-700 hover:text-white transition-all">
                        Access PDF
                      </button>
                    </div>
                  </div>
                ))}

                {/* Unowned Ebooks (Placeholders) */}
                {unownedEbooks.map((ebook) => (
                  <div key={ebook.id} className="group bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-5 flex flex-col justify-center items-center text-center space-y-4 hover:bg-white hover:border-amber-100 transition-all">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700/30 group-hover:text-amber-700 transition-all">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 group-hover:text-gray-600 px-2 line-clamp-2 transition-all">{ebook.title}</h4>
                    </div>
                    <Link 
                      to="/shop"
                      className="w-full py-2 border border-amber-700/10 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-50 transition-all"
                    >
                      Buy an E-Book
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-10">Consultation History</h2>
            {consultationHistory.length > 0 ? (
              <div className="space-y-4">
                {consultationHistory.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-100 transition-all group shadow-sm">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-all">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{booking.service}</h3>
                        <p className="text-xs text-gray-500">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${
                        booking.status === 'Completed' ? 'bg-green-100 text-green-700'
                        : booking.status === 'Cancelled' ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.recordingUrl && (
                        <button className="p-3 text-gray-300 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all">
                          <PlayCircle size={22} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <p className="text-gray-500 mb-8">You have no active or past consultations.</p>
                <Link to="/consultations" className="px-10 py-4 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-800 transition-all">
                  Buy a Service
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dm' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-10">Priority Research Requests</h2>
            {MOCK_MEMBER_DATA.priorityDMs.length > 0 ? (
              <div className="space-y-4">
                {MOCK_MEMBER_DATA.priorityDMs.map((dm) => (
                  <div key={dm.id} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold text-gray-900 max-w-lg leading-relaxed">{dm.question}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-amber-50 text-amber-700 rounded-lg">
                        {dm.status}
                      </span>
                    </div>
                    {dm.response && (
                      <div className="p-6 bg-gray-50 rounded-2xl text-sm text-gray-600 leading-relaxed italic border-l-4 border-amber-700 relative">
                        <span className="absolute -top-3 left-6 px-2 bg-gray-50 text-[9px] font-bold uppercase tracking-widest text-amber-700">Astrokarak Response</span>
                        "{dm.response}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <p className="text-gray-500 mb-8">No priority requests active.</p>
                <Link to="/consultations" className="px-10 py-4 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-800 transition-all">
                  Buy a Priority DM
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <h2 className="text-xs font-bold text-amber-700 uppercase tracking-[0.3em] mb-10">Saved Research Papers</h2>
            {MOCK_MEMBER_DATA.savedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_MEMBER_DATA.savedBlogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-amber-200 transition-all shadow-sm group">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h4 className="font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{blog.title}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{blog.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                <p className="text-gray-500 mb-8">Your saved archive is empty.</p>
                <Link to="/blog" className="px-10 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all">
                  Explore Research
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
