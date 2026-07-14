import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, DollarSign, Users, Trophy, type LucideIcon } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import type { User } from '../types';

const ROLE_LABELS: Record<User['role'], string> = {
  superAdmin: 'Super Admin',
  locationManager: 'Location Manager',
  financeOfficer: 'Finance Officer',
  coach: 'Coach',
  parent: 'Parent / Guardian',
};

const ROLE_DESTINATIONS: Record<User['role'], string> = {
  superAdmin: '/super-admin/dashboard',
  locationManager: '/location-manager/schedule',
  financeOfficer: '/finance/rate-cards',
  coach: '/coach/sessions',
  parent: '/parent/dashboard',
};

const ROLE_COLORS: Record<User['role'], string> = {
  superAdmin: 'bg-primary/10 text-primary border-primary/20',
  locationManager: 'bg-success/10 text-success border-success/20',
  financeOfficer: 'bg-warning/10 text-warning border-warning/20',
  coach: 'bg-danger/10 text-danger border-danger/20',
  parent: 'bg-text/10 text-text border-text/20',
};

const ROLE_ICONS: Record<User['role'], LucideIcon> = {
  superAdmin: Shield,
  locationManager: Building2,
  financeOfficer: DollarSign,
  coach: Trophy,
  parent: Users,
};

export function LoginSelect() {
  const users = useDataStore((s) => s.users);
  const setCurrentUser = useDataStore((s) => s.setCurrentUser);
  const navigate = useNavigate();

  // One representative user per role, used to drive the role grid + top card
  const roleUsers = Object.values(
    users.reduce<Partial<Record<User['role'], User>>>((acc, u) => {
      if (!acc[u.role]) acc[u.role] = u;
      return acc;
    }, {})
  ) as User[];

  const [selected, setSelected] = useState<User>(roleUsers[0]);

  function handleSelect(userId: string, role: User['role']) {
    setCurrentUser(userId);
    navigate(ROLE_DESTINATIONS[role]);
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left brand panel */}
      <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-[#1B4332] p-10 text-white md:flex">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px, 60px 60px',
          }}
        />
        <div className="relative flex h-10 items-center rounded-md bg-white/95 px-4 self-start">
          <img src="/neomora-logo.png" alt="Neomora" className="h-6 w-auto" />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">
            Run your academy
            <br /> like a pro club.
          </h2>
          <p className="mt-4 max-w-sm text-white/80">
            One platform for participants, sessions, fees, and family communication
            across every location.
          </p>
        </div>
        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} Neomora Club Manager
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <img src="/neomora-logo.png" alt="Neomora" className="mx-auto h-7 w-auto" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-text-muted">
            Sign in to your <span className="font-semibold text-text">{ROLE_LABELS[selected.role]}</span> portal.
          </p>

          {/* Demo-only form, mirrors the design; actual navigation happens via the role grid below */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSelect(selected.id, selected.role);
            }}
            className="mt-6 space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-text">
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue={selected.email}
                readOnly
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-text">
                  Password
                </label>
                <a href="#" className="text-xs text-text-muted hover:text-text">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                defaultValue="demo1234"
                readOnly
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1B4332]/90"
            >
              Sign In as {ROLE_LABELS[selected.role]}
            </button>
          </form>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
              <div className="h-px flex-1 bg-border" />
              <span>Or change selected portal</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="mb-3 text-xs text-text-muted">Select your role to update the form target:</p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roleUsers.map((user) => {
                const isSelected = selected.role === user.role;
                const Icon = ROLE_ICONS[user.role];
                return (
                  <button
                    key={user.role}
                    type="button"
                    onClick={() => {
                      setSelected(user);
                      handleSelect(user.id, user.role);
                    }}
                    className={`flex items-center gap-3 rounded-md border bg-surface px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:border-primary/50 hover:bg-primary/5 ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'border-border'
                      }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md shrink-0 ${ROLE_COLORS[user.role]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{ROLE_LABELS[user.role]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-text-muted">
            <a href="/" className="hover:text-text">
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}