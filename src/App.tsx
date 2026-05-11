import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { insforge } from './lib/insforge';
import HomePage from './pages/HomePage';
import CreateListing from './pages/CreateListing';
import PropertyDetail from './pages/PropertyDetail';
import AuthPage from './pages/AuthPage';
import { Button } from './components/ui/Button';

// Using any because we just want to avoid strict Firebase User type
function Layout({ children, user, loading }: { children: React.ReactNode, user: any | null, loading: boolean }) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg font-sans flex flex-col p-6 md:p-12 overflow-x-hidden select-none">
      <header className="flex justify-between items-baseline mb-20 w-full max-w-5xl mx-auto">
        <Link to="/" className="text-2xl font-light tracking-[0.2em] uppercase text-white">
          Estate.
        </Link>
        <nav className="flex items-center gap-4 md:gap-12 text-[10px] md:text-[11px] font-medium tracking-widest uppercase text-neutral-500">
          <Link to="/" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 hidden sm:inline-block">Buy</Link>
          <Link to="/" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 hidden sm:inline-block">Sell</Link>
          <Link to="/list" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 text-white border-white">Apply</Link>
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-4 ml-2 md:ml-8 pl-4 md:pl-8 border-l border-neutral-800">
                <span className="hidden lg:inline-block">
                  {user.email?.split('@')[0]}
                </span>
                <button className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1" onClick={async () => {
                  await insforge.auth.signOut();
                  window.location.reload();
                }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2 md:ml-8 pl-4 md:pl-8 border-l border-neutral-800">
                <Link to="/auth" className="text-white border-b border-white pb-1">
                  Sign In
                </Link>
              </div>
            )
          )}
        </nav>
      </header>
      <main className="flex-grow w-full max-w-5xl mx-auto">
        {children}
      </main>
      <footer className="mt-20 max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-700 pt-8 border-t border-neutral-900 gap-4 pb-4">
        <div>&copy; {new Date().getFullYear()} Estate Minimal</div>
        <div>Privacy / Terms</div>
        <div>London &mdash; NYC &mdash; Tokyo</div>
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  return (
    <Router>
      <Layout user={user} loading={loading}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/list" element={<CreateListing user={user} />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}
