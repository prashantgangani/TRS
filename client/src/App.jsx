import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Members from './pages/Members';
import Showroom from './pages/Showroom';
import Garage from './pages/Garage';
import AdminAddMeet from './pages/AdminAddMeet';
import ScrollToTop from './components/ScrollToTop';
import Laws from './pages/Laws';
import Timezones from './pages/Timezones';
import AdminLogin from './pages/AdminLogin';
import SubmitFeedback from './pages/SubmitFeedback';
import ManageFeedbacks from './pages/ManageFeedbacks';
import AdminLogs from './pages/AdminLogs';
import ValidCars from './pages/ValidCars';
import AdminCarLibrary from './pages/AdminCarLibrary';
import PreviousMeets from './pages/PreviousMeets';
import SmartAdmin from './pages/SmartAdmin';
import PasswordManager from './pages/PasswordManager';
import ManageCrewMembers from './pages/ManageCrewMembers';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';
import Memes from './pages/Memes';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { API_URL } from './config';

function App() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem('trs_role') || 'user');
  const [settings, setSettings] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // Skip loader for login paths so direct URL visits don't force a 5 second wait
  const skipLoaderPaths = ['/admin-login', '/member-login'];
  const [showLoader, setShowLoader] = useState(!skipLoaderPaths.includes(location.pathname));

  
  useEffect(() => {
    // Keep state in sync if local storage changes (e.g. login/logout)
    const storedRole = localStorage.getItem('trs_role') || 'user';
    if (storedRole !== role) {
      setRole(storedRole);
    }
  }, [role]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/settings`).then(res => res.json()),
      new Promise(resolve => setTimeout(resolve, 5000))
    ])
      .then(([data]) => {
        setSettings(data);
        setIsAppLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings:", err);
        setIsAppLoading(false);
      });
  }, []);

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperAdmin = role === 'superadmin';
  const isSmartAdmin = role === 'smartadmin';
  const isPasswordManager = role === 'passwordmanager';

  // Smart Admin Feature Toggles
  const canEditHero = isSuperAdmin || (isAdmin && settings?.editHero !== false);
  const canPublishMeet = isSuperAdmin || (isAdmin && settings?.publishMeet !== false);
  const canUpdateValidCars = isSuperAdmin || (isAdmin && settings?.updateValidCars !== false);
  const canManageGarage = isSuperAdmin || (isAdmin && settings?.manageGarage !== false);
  const canManageShowroom = isSuperAdmin || (isAdmin && settings?.manageShowroom !== false);
  const canManageLaws = isSuperAdmin || (isAdmin && settings?.manageLaws !== false);
  const canManageTimezones = isSuperAdmin || (isAdmin && settings?.manageTimezones !== false);
  const canManagePreviousMeets = isSuperAdmin || (isAdmin && settings?.managePreviousMeets !== false);
  const canArrangeGarage = isSuperAdmin || (isAdmin && settings?.allowAdminCarArrange !== false);
  const canManageMemes = isSuperAdmin || (isAdmin && settings?.manageMemes !== false);

  if (isSmartAdmin) {
    return (
      <>
        {showLoader && (
          <LoadingScreen 
            isLoading={isAppLoading} 
            onComplete={() => setShowLoader(false)} 
          />
        )}
        <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-neon-purple/50">
          {location.pathname !== "/password-manager" && <Navbar role={role} setRole={setRole} />}
          <Routes>
            {/* Force routing all unhandled smartadmin paths back to their control panel */}
            <Route path="*" element={<SmartAdmin />} />
          </Routes>
        </div>
      </>
    );
  }

  if (isPasswordManager) {
    return (
      <>
        {showLoader && (
          <LoadingScreen 
            isLoading={isAppLoading} 
            onComplete={() => setShowLoader(false)} 
          />
        )}
        <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-oracle-gold/50">
          {location.pathname !== "/password-manager" && <Navbar role={role} setRole={setRole} />}
          <Routes>
            {/* Force routing all unhandled passwordmanager paths back to their control panel */}
            <Route path="*" element={<PasswordManager />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <>
      {showLoader && (
        <LoadingScreen 
          isLoading={isAppLoading} 
          onComplete={() => setShowLoader(false)} 
        />
      )}
      <div className="relative w-full min-h-screen bg-deep-black text-white selection:bg-neon-purple/50">
        <ScrollToTop />
      {location.pathname !== "/password-manager" && <Navbar role={role} setRole={setRole} />}
      <Routes>
        <Route path="/" element={<Home canEditHero={canEditHero} canPublishMeet={canPublishMeet} />} />
        <Route path="/garage" element={<Garage isAdmin={canManageGarage} isSuperAdmin={isSuperAdmin} canArrangeGarage={canArrangeGarage} />} />
        <Route path="/members" element={<Members isSuperAdmin={isSuperAdmin} />} />
        <Route path="/laws" element={<Laws isAdmin={canManageLaws} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/timezones" element={<Timezones isAdmin={canManageTimezones} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/memes" element={<Memes isAdmin={canManageMemes} isSuperAdmin={isSuperAdmin} />} />
        <Route path="/showroom" element={<Showroom isAdmin={canManageShowroom} />} />
        <Route path="/admin/add-meet" element={<AdminAddMeet isAdmin={canPublishMeet} />} />
        <Route path="/valid-cars" element={<ValidCars isAdmin={canUpdateValidCars} />} />
        <Route path="/admin/car-library" element={<AdminCarLibrary isAdmin={canUpdateValidCars} />} />
        <Route path="/previous-meets" element={<PreviousMeets isAdmin={canManagePreviousMeets} />} />
        <Route path="/admin-login" element={<AdminLogin setAuthContext={setRole} />} />
        <Route path="/feedback" element={<SubmitFeedback />} />
        <Route path="/manage-feedbacks" element={isAdmin ? <ManageFeedbacks /> : <Home />} />
        <Route path="/logs" element={isSuperAdmin ? <AdminLogs /> : <Home />} />
        <Route path="/smart-admin" element={isSuperAdmin ? <SmartAdmin /> : <Home />} />
        <Route path="/password-manager" element={isSuperAdmin || role === 'passwordmanager' ? <PasswordManager /> : <Home />} />
        <Route path="/manage-crew-members" element={isSuperAdmin ? <ManageCrewMembers /> : <Home />} />
        <Route path="/member-login" element={<MemberLogin setAuthContext={setRole} />} />
        <Route path="/member-dashboard" element={role === 'member' ? <MemberDashboard setAuthContext={setRole} /> : <Home />} />
      </Routes>
      <footer className="w-full py-8 border-t border-white/5 text-center text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} Underground Meets. A GTA Online Crew.</p>
      </footer>
    </div>
    </>
  );
}

export default App;


