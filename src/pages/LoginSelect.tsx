import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import type { User } from '../types';

const ROLE_LABELS: Record<User['role'], string> = {
  superAdmin: 'Super Admin',
  locationManager: 'Location Manager',
  financeOfficer: 'Finance Officer',
  coach: 'Coach',
  parent: 'Parent',
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

export function LoginSelect() {
  const users = useDataStore((s) => s.users);
  const setCurrentUser = useDataStore((s) => s.setCurrentUser);
  const navigate = useNavigate();

  function handleSelect(userId: string, role: User['role']) {
    setCurrentUser(userId);
    navigate(ROLE_DESTINATIONS[role]);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground text-2xl font-bold mb-4">
            N
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Choose a Role</h1>
          <p className="mt-2 text-text-muted text-sm">
            Select a mock user to explore that portal's features.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.id, user.role)}
              className="w-full bg-surface border border-border rounded-lg px-5 py-4 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all text-left group"
            >
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-semibold text-sm shrink-0 ${ROLE_COLORS[user.role]}`}
              >
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text text-sm">{user.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ROLE_COLORS[user.role]}`}
              >
                {ROLE_LABELS[user.role]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
