// Central data-driven nav config for every portal.
// Components import the array they need — nothing is hardcoded in the shell.

import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  BookOpen,
  Users,
  CalendarRange,
  ClipboardList,
  ListOrdered,
  CreditCard,
  Percent,
  Receipt,
  FileText,
  ClipboardCheck,
  Home,
  UserPlus,
  Banknote,
  Settings,
  BarChart3,
  // FilePlus
} from 'lucide-react';
import type { NavItem } from '../components/layout/Sidebar';

export const superAdminNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
  { label: 'Locations', icon: MapPin, path: '/super-admin/locations' },
  { label: 'Seasons & Terms', icon: CalendarDays, path: '/super-admin/seasons-terms' },
  { label: 'Programs', icon: BookOpen, path: '/super-admin/programs' },
  { label: 'Users', icon: Users, path: '/super-admin/users' },
  { label: 'Participants', icon: UserPlus, path: '/super-admin/register' },
  // { label: 'Registration Form', icon: FilePlus, path: '/super-admin/register-form' },
  { label: 'Reports', icon: BarChart3, path: '/super-admin/reports' },
  { label: 'Settings', icon: Settings, path: '/super-admin/settings' },


];

export const locationManagerNav: NavItem[] = [
  { label: 'Schedule', icon: CalendarRange, path: '/location-manager/schedule' },
  { label: 'Roster', icon: ClipboardList, path: '/location-manager/roster' },
  { label: 'Waitlist', icon: ListOrdered, path: '/location-manager/waitlist' },
];

export const financeNav: NavItem[] = [
  { label: 'Rate Cards', icon: CreditCard, path: '/finance/rate-cards' },
  { label: 'Discount Rules', icon: Percent, path: '/finance/discount-rules' },
  { label: 'VAT Config', icon: Receipt, path: '/finance/vat' },
  { label: 'Invoices', icon: FileText, path: '/finance/invoices' },
];

export const coachNav: NavItem[] = [
  { label: 'Sessions', icon: CalendarRange, path: '/coach/sessions' },
  { label: 'Attendance', icon: ClipboardCheck, path: '/coach/attendance' },
];

export const parentNav: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/parent/dashboard' },
  { label: 'Register', icon: UserPlus, path: '/parent/register' },
  { label: 'Payments', icon: Banknote, path: '/parent/payments' },
  { label: 'Schedule', icon: CalendarRange, path: '/parent/schedule' },
];
