import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const currentUser = useDataStore((state) => state.currentUser);

  const user = {
    name: currentUser?.name || 'John Admin',
    role: currentUser?.role || 'Admin',
    email: currentUser?.email || 'admin@neomora.com',
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="w-[260px] bg-[#1B4332] border-none h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="flex flex-col items-center p-5 gap-3 ">
        <div className="w-full flex h-10 items-center justify-center rounded-md bg-[#F4F4F5]">
          <img
            src="/neomora-logo.png"
            alt="logo"
            className="h-6 w-auto object-contain"
          />
        </div>
        <p className="text-xs text-[#D7E5DD] uppercase  ">{currentUser?.role.replace(/([A-Z])/g, ' $1').trim() || 'Guest'}</p>

      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="truncate text-xs text-[#90B4A0]">{user.email}</p>
          </div>
          <Link
            to="/login-select"
            title="Sign out"
            aria-label="Sign out"
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}