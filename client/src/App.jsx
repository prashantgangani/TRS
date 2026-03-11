import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Members from './pages/Members';
import Showroom from './pages/Showroom';
import AdminAddMeet from './pages/AdminAddMeet';
import ScrollToTop from './components/ScrollToTop';
import Laws from './pages/Laws';
import Timezones from './pages/Timezones';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [role, setRole] = useState(localStorage.getItem('trs_role') || 'user');
  
  useEffect(() => {
    // Keep state in sync if local storage changes (e.g. login/logout)
    const storedRole = localStorage.getItem('trs_role') || 'user';
    if (storedRole !== role) {
      setRole(storedRole);
    }
  }, [role]);

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperAdmin = role === 'superadmin';

  return (
    <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-neon-purple/50">
      <ScrollToTop />
      <Navbar role={role} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route path="/members" element={<Members isSuperAdmin={isSuperAdmin} />} />
        <Route path="/laws" element={<Laws isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/timezones" element={<Timezones isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/showroom" element={<Showroom isAdmin={isAdmin} />} />
        <Route path="/admin/add-meet" element={<AdminAddMeet isAdmin={isAdmin} />} />
        <Route path="/admin-login" element={<AdminLogin setAuthContext={setRole} />} />
      </Routes>
      <footer className="w-full py-8 border-t border-white/5 text-center text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} Underground Meets. A GTA Online Crew.</p>
      </footer>
    </div>
  );
}

export default App;
