import { Bell, Search, Menu, Home, ChevronRight, LogOut } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useDataStore } from '../../store/dataStore';
import type { NavItem } from './Sidebar';

interface TopbarProps {
  navItems?: NavItem[];
  portalTitle?: string;
  hideSearch?: boolean;
}

export function Topbar({ navItems, portalTitle = 'Guardian Portal', hideSearch = false }: TopbarProps) {
  const currentUser = useDataStore((state) => state.currentUser);
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const initials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const isNavMode = Boolean(navItems?.length);

  if (isNavMode) {
    return (
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 px-4 py-3 shadow-sm backdrop-blur md:px-6 ">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="flex min-w-0 items-center gap-3 ">
            <img
              src="/neomora-logo.png"
              alt="Neomora"
              className="h-8 w-auto shrink-0 object-contain bg-[#1B4332] rounded-md p-1 brightness-90"
            />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-text">{portalTitle}</p>
            </div>
          </div>

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto px-2">
            {navItems!.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-muted hover:bg-surface-muted hover:text-text'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-text">{currentUser?.name || 'Fatima Al-Harbi'}</p>
              <p className="text-xs text-text-muted capitalize">{currentUser?.role || 'Guardian'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/15">
              {initials}
            </div>
            <Link
              to="/login-select"
              title="Sign out"
              aria-label="Sign out"
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-text-muted hover:text-text rounded-md hover:bg-surface-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center text-sm">
          <Home className="w-4 h-4 text-text-muted mr-1" />
          <ChevronRight className="w-4 h-4 text-text-muted mx-1" />
          <span className="text-primary hover:underline cursor-pointer">Super Admin</span>
          {pathSegments.length > 1 && (
            <>
              <ChevronRight className="w-4 h-4 text-text-muted mx-1" />
              <span className="text-primary hover:underline cursor-pointer capitalize">
                {pathSegments[1].replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        {!hideSearch && (
          <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 lg:w-96 transition-all"
          />
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-6 flex-1">
        {/* <button
          onClick={() => navigate('/login-select')}
          className="text-xs font-medium text-text-muted hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5 hover:border-primary/50 hidden sm:block"
        >
          Switch Role
        </button> */}

        {/* <div className="h-6 w-px bg-border hidden sm:block"></div> */}

        <button className="relative text-text-muted hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border border-surface"></span>
        </button>

        {/* <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-text">{currentUser?.name || 'Unknown User'}</p>
            <p className="text-xs text-text-muted capitalize">{currentUser?.role.replace(/([A-Z])/g, ' $1').trim() || 'Guest'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold border border-primary/20">
            {initials}
          </div>
        </div> */}
      </div>
    </header>
  );
}
