
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';

// Pages
import Home from './pages/Home';
import StartHere from './pages/StartHere';
import About from './pages/About';
import Contact from './pages/Contact';
import Consultations from './pages/Consultations';
import Shop from './pages/Shop';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CategoryPage from './pages/CategoryPage';
import Legal from './pages/Legal';
import AnimatedShortVideos from './pages/AnimatedShortVideos';
import AdminDashboard from './pages/AdminDashboard';
import MemberProfile from './pages/MemberProfile';
import Community from './pages/Community';
import JyotishBooks from './pages/JyotishBooks';
import JyotishBookSubcategory from './pages/JyotishBookSubcategory';
import TextReadingForm from './pages/TextReadingForm';
import Reviews from './pages/Reviews';
import AuthCallback from './pages/AuthCallback';
import RequireAdminRoute from './components/RequireAdminRoute';
import RequireSiteAccessRoute from './components/RequireSiteAccessRoute';
import RequireMemberRoute from './components/RequireMemberRoute';
import PublicLogin from './pages/PublicLogin';

// Admin Editor
import BlogEditor from './src/admin/pages/BlogEditor';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<PublicLogin />} />

          {/* Admin Routes - Rendered standalone without Public Navbar */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route element={<RequireAdminRoute />}>
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
          </Route>

          {/* Auth callback for Supabase OAuth (Google) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public app requires user access: auth user or guest */}
          <Route element={<RequireSiteAccessRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/start-here" element={<StartHere />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/reels" element={<AnimatedShortVideos />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/priority-dm" element={<Contact />} />
              <Route path="/community" element={<Community />} />
              <Route path="/jyotish-books" element={<JyotishBooks />} />
              <Route path="/jyotish-books/:categoryId/:subcategorySlug" element={<JyotishBookSubcategory />} />
              <Route path="/text-reading" element={<TextReadingForm />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
              <Route path="/refund-policy" element={<Legal />} />
              <Route path="/disclaimer" element={<Legal />} />

              <Route element={<RequireMemberRoute />}>
                <Route path="/profile" element={<MemberProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
