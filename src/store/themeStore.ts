import { create } from 'zustand';

interface ThemeState {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  accentColor: '37 99 235', // Default primary blue
  setAccentColor: (color) => {
    set({ accentColor: color });
    document.documentElement.style.setProperty('--color-primary', color);
  },
}));
