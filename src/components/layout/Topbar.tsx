import { Bell, Search, Menu, Home, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Topbar() {
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);

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
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 lg:w-96 transition-all"
          />
        </div>
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
