import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginSelect } from './pages/LoginSelect';
import { UIKit } from './pages/UIKit';
import {
  superAdminNav,
  locationManagerNav,
  financeNav,
  coachNav,
  parentNav,
} from './router/portalNav';
import { Dashboard as SuperAdminDashboard } from './pages/super-admin/Dashboard';
import { Locations as SuperAdminLocations } from './pages/super-admin/Locations';
import { SeasonsTerms as SuperAdminSeasonsTerms } from './pages/super-admin/SeasonsTerms';
import { Programs as SuperAdminPrograms } from './pages/super-admin/Programs';
import { Users as SuperAdminUsers } from './pages/super-admin/Users';
import { Reports as SuperAdminReports } from './pages/super-admin/Reports';
import { Settings as SuperAdminSettings } from './pages/super-admin/Settings';
import { Register as SuperAdminRegister } from './pages/super-admin/Register';
import { RegistrationForm as SuperAdminRegistrationForm } from './pages/super-admin/RegistrationForm';
import { Schedule as LocationManagerSchedule } from './pages/location-manager/Schedule';
import { Roster as LocationManagerRoster } from './pages/location-manager/Roster';
import { Waitlist as LocationManagerWaitlist } from './pages/location-manager/Waitlist';
import { RateCards as FinanceRateCards } from './pages/finance/RateCards';
import { DiscountRules as FinanceDiscountRules } from './pages/finance/DiscountRules';
import { Vat as FinanceVat } from './pages/finance/Vat';
import { Invoices as FinanceInvoices } from './pages/finance/Invoices';
import { Sessions as CoachSessions } from './pages/coach/Sessions';
import { AttendancePage as CoachAttendance } from './pages/coach/Attendance';
import { ParentDashboard } from './pages/parent/Dashboard';
import { Register as ParentRegister } from './pages/parent/Register';
import { Payments as ParentPayments } from './pages/parent/Payments';
import { ParentSchedule } from './pages/parent/Schedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login-select" replace />} />

        {/* Auth-less role picker */}
        <Route path="/login-select" element={<LoginSelect />} />

        {/* Temporary UI Kit */}
        <Route path="/ui-kit" element={<UIKit />} />

        {/* ── Super Admin ─────────────────────────────────── */}
        <Route path="/super-admin" element={<AppShell navItems={superAdminNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="locations" element={<SuperAdminLocations />} />
          <Route path="seasons-terms" element={<SuperAdminSeasonsTerms />} />
          <Route path="programs" element={<SuperAdminPrograms />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="reports" element={<SuperAdminReports />} />
          <Route path="settings" element={<SuperAdminSettings />} />
          <Route path="register" element={<SuperAdminRegister />} />
          <Route path="register-form" element={<SuperAdminRegistrationForm />} />
        </Route>

        {/* ── Location Manager ────────────────────────────── */}
        <Route path="/location-manager" element={<AppShell navItems={locationManagerNav} />}>
          <Route index element={<Navigate to="schedule" replace />} />
          <Route path="schedule" element={<LocationManagerSchedule />} />
          <Route path="roster" element={<LocationManagerRoster />} />
          <Route path="waitlist" element={<LocationManagerWaitlist />} />
        </Route>

        {/* ── Finance ─────────────────────────────────────── */}
        <Route path="/finance" element={<AppShell navItems={financeNav} />}>
          <Route index element={<Navigate to="rate-cards" replace />} />
          <Route path="rate-cards" element={<FinanceRateCards />} />
          <Route path="discount-rules" element={<FinanceDiscountRules />} />
          <Route path="vat" element={<FinanceVat />} />
          <Route path="invoices" element={<FinanceInvoices />} />
        </Route>

        {/* ── Coach ───────────────────────────────────────── */}
        <Route path="/coach" element={<AppShell navItems={coachNav} />}>
          <Route index element={<Navigate to="sessions" replace />} />
          <Route path="sessions" element={<CoachSessions />} />
          <Route path="attendance" element={<CoachAttendance />} />
        </Route>

        {/* ── Parent ──────────────────────────────────────── */}
        <Route path="/parent" element={<AppShell navItems={parentNav} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="register" element={<ParentRegister />} />
          <Route path="payments" element={<ParentPayments />} />
          <Route path="schedule" element={<ParentSchedule />} />
        </Route>

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary">404</p>
                <p className="text-text-muted mt-2">Page not found.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
