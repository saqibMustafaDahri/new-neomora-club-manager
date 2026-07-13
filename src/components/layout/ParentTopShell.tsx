// import { Outlet } from 'react-router-dom';
// import { ToastProvider } from '../ui/Toast';
// import { Topbar } from './Topbar';
// import type { NavItem } from './Sidebar';

// interface ParentShellProps {
//   navItems: NavItem[];
// }

// export function ParentShell({ navItems }: ParentShellProps) {
//   return (
//     <ToastProvider>
//       <div className="flex min-h-screen flex-col bg-background">
//         <Topbar navItems={navItems} portalTitle="Guardian Portal" hideSearch />

//         <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//     </ToastProvider>
//   );
// }


import { Outlet, NavLink, Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useDataStore } from '../../store/dataStore';
import { ToastProvider } from '../ui/Toast';
import { parentTopNav } from '../../router/portalNav';

export function ParentTopShell() {
  const currentUser = useDataStore((s) => s.currentUser);

  const initials = (currentUser?.name || 'Parent')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/parent/dashboard" className="flex items-center h-9 shrink-0">
              <img src="/neomora-logo.png" alt="Neomora" className="h-6 w-auto" />
            </Link>

            {/* Nav links */}
            <nav className="flex-1 flex items-center gap-1">
              {parentTopNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted hover:text-text hover:bg-surface-muted'
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right: notifications shortcut + user + sign out */}
            <div className="flex items-center gap-4 shrink-0">
              <NavLink to="/parent/notifications" className="relative text-text-muted hover:text-text transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border border-surface" />
              </NavLink>

              <div className="h-6 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-sm font-medium text-text truncate max-w-[140px]">{currentUser?.name || 'Guardian'}</p>
                </div>
              </div>

              <Link
                to="/login-select"
                title="Sign out"
                aria-label="Sign out"
                className="text-text-muted hover:text-danger transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
