import { Bell, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useDataStore } from '../../store/dataStore';

const themePresets = [
  { name: 'Blue', color: '37 99 235' }, // Blue 600
  { name: 'Emerald', color: '5 150 105' }, // Emerald 600
  { name: 'Violet', color: '124 58 237' }, // Violet 600
  { name: 'Rose', color: '225 29 72' }, // Rose 600
];

export function Topbar() {
  const { setAccentColor } = useThemeStore();
  const currentUser = useDataStore((state) => state.currentUser);
  const navigate = useNavigate();

  // Helper to get initials
  const initials = currentUser?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <header className="h-16 bg-surface border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-text-muted hover:text-text rounded-md hover:bg-surface-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:block mr-2">Theme</span>
          {themePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setAccentColor(preset.color)}
              className="w-6 h-6 rounded-full border-2 border-surface shadow-sm focus:outline-none transition-transform hover:scale-110"
              style={{ backgroundColor: `rgb(${preset.color})` }}
              title={preset.name}
              aria-label={`Set theme to ${preset.name}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => navigate('/ui-kit')}
          className="text-xs font-medium text-text-muted hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5 hover:border-primary/50 hidden sm:block"
        >
          UI Kit
        </button>

        <button
          onClick={() => navigate('/login-select')}
          className="text-xs font-medium text-text-muted hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5 hover:border-primary/50 hidden sm:block"
        >
          Switch Role
        </button>

        <div className="h-6 w-px bg-border hidden sm:block"></div>
        
        <button className="relative text-text-muted hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border border-surface"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-text">{currentUser?.name || 'Unknown User'}</p>
            <p className="text-xs text-text-muted capitalize">{currentUser?.role.replace(/([A-Z])/g, ' $1').trim() || 'Guest'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold border border-primary/20">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
