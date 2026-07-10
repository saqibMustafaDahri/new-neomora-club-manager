import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
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
  const organization = useDataStore((state) => state.organizations[0]);
  const orgName = organization?.name || 'Neomo';

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            {orgName.charAt(0)}
          </div>
          {orgName}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface-muted hover:text-text'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border text-xs text-text-muted text-center">
        © 2026 {orgName} Inc.
      </div>
    </aside>
  );
}
