// import { create } from 'zustand';
// import * as mock from '../data/mockData';
// import type * as Types from '../types';

// export interface DataState {
//   organizations: Types.Organization[];
//   locations: Types.Location[];
//   pitches: Types.Pitch[];
//   seasons: Types.Season[];
//   terms: Types.Term[];
//   programs: Types.Program[];
//   cohortRules: Types.CohortRule[];
//   cohorts: Types.Cohort[];
//   sessionTemplates: Types.SessionTemplate[];
//   rateCards: Types.RateCard[];
//   discountRules: Types.DiscountRule[];
//   vatConfigs: Types.VatConfig[];
//   families: Types.Family[];
//   students: Types.Student[];
//   registrations: Types.Registration[];
//   invoices: Types.Invoice[];
//   payments: Types.Payment[];
//   sessionEnrollments: Types.SessionEnrollment[];
//   attendances: Types.Attendance[];
//   waitlistEntries: Types.WaitlistEntry[];
//   users: Types.User[];
//   coachAssignments: Types.CoachAssignment[];
//   currentUser: Types.User | null;

//   // Generic action helpers can be added here, or we can just define specific ones if needed.
//   // We'll expose a generic way to update collections to save space, but provide specific getters/setters as requested.
//   setCollection: <K extends keyof DataState>(key: K, data: DataState[K]) => void;
//   setCurrentUser: (userId: string | null) => void;
// }

// export const useDataStore = create<DataState>((set) => ({
//   organizations: mock.mockOrganizations,
//   locations: mock.mockLocations,
//   pitches: mock.mockPitches,
//   seasons: mock.mockSeasons,
//   terms: mock.mockTerms,
//   programs: mock.mockPrograms,
//   cohortRules: mock.mockCohortRules,
//   cohorts: mock.mockCohorts,
//   sessionTemplates: mock.mockSessionTemplates,
//   rateCards: mock.mockRateCards,
//   discountRules: mock.mockDiscountRules,
//   vatConfigs: mock.mockVatConfigs,
//   families: mock.mockFamilies,
//   students: mock.mockStudents,
//   registrations: mock.mockRegistrations,
//   invoices: mock.mockInvoices,
//   payments: mock.mockPayments,
//   sessionEnrollments: mock.mockSessionEnrollments,
//   attendances: mock.mockAttendances,
//   waitlistEntries: mock.mockWaitlistEntries,
//   users: mock.mockUsers,
//   coachAssignments: mock.mockCoachAssignments,
//   currentUser: mock.mockUsers[0] || null,

//   setCollection: (key, data) => set({ [key]: data } as any),
//   setCurrentUser: (userId) => set((state) => ({ currentUser: state.users.find(u => u.id === userId) || null })),
// }));

// // Helper to create CRUD actions for a specific entity type
// function createActions<T extends { id: string }, K extends keyof DataState>(collectionKey: K) {
//   return {
//     getAll: (): T[] => useDataStore.getState()[collectionKey] as any,
//     getById: (id: string): T | undefined => {
//       const items = useDataStore.getState()[collectionKey] as any as T[];
//       return items.find((item) => item.id === id);
//     },
//     add: (item: T) => {
//       const state = useDataStore.getState();
//       const items = state[collectionKey] as any as T[];
//       state.setCollection(collectionKey, [...items, item] as any);
//     },
//     update: (id: string, updates: Partial<T>) => {
//       const state = useDataStore.getState();
//       const items = state[collectionKey] as any as T[];
//       state.setCollection(collectionKey, items.map((item) => (item.id === id ? { ...item, ...updates } : item)) as any);
//     },
//     delete: (id: string) => {
//       const state = useDataStore.getState();
//       const items = state[collectionKey] as any as T[];
//       state.setCollection(collectionKey, items.filter((item) => item.id !== id) as any);
//     },
//   };
// }

// export const OrganizationActions = createActions<Types.Organization, 'organizations'>('organizations');
// export const LocationActions = createActions<Types.Location, 'locations'>('locations');
// export const PitchActions = createActions<Types.Pitch, 'pitches'>('pitches');
// export const SeasonActions = createActions<Types.Season, 'seasons'>('seasons');
// export const TermActions = createActions<Types.Term, 'terms'>('terms');
// export const ProgramActions = createActions<Types.Program, 'programs'>('programs');
// export const CohortRuleActions = createActions<Types.CohortRule, 'cohortRules'>('cohortRules');
// export const CohortActions = createActions<Types.Cohort, 'cohorts'>('cohorts');
// export const SessionTemplateActions = createActions<Types.SessionTemplate, 'sessionTemplates'>('sessionTemplates');
// export const RateCardActions = createActions<Types.RateCard, 'rateCards'>('rateCards');
// export const DiscountRuleActions = createActions<Types.DiscountRule, 'discountRules'>('discountRules');
// export const VatConfigActions = createActions<Types.VatConfig, 'vatConfigs'>('vatConfigs');
// export const FamilyActions = createActions<Types.Family, 'families'>('families');
// export const StudentActions = createActions<Types.Student, 'students'>('students');
// export const RegistrationActions = createActions<Types.Registration, 'registrations'>('registrations');
// export const InvoiceActions = createActions<Types.Invoice, 'invoices'>('invoices');
// export const PaymentActions = createActions<Types.Payment, 'payments'>('payments');
// export const SessionEnrollmentActions = createActions<Types.SessionEnrollment, 'sessionEnrollments'>('sessionEnrollments');
// export const AttendanceActions = createActions<Types.Attendance, 'attendances'>('attendances');
// export const WaitlistEntryActions = createActions<Types.WaitlistEntry, 'waitlistEntries'>('waitlistEntries');
// export const UserActions = createActions<Types.User, 'users'>('users');
// export const CoachAssignmentActions = createActions<Types.CoachAssignment, 'coachAssignments'>('coachAssignments');





import { create } from 'zustand';
import * as mock from '../data/mockData';
import type * as Types from '../types';

export interface DataState {
  organizations: Types.Organization[];
  locations: Types.Location[];
  pitches: Types.Pitch[];
  seasons: Types.Season[];
  terms: Types.Term[];
  programs: Types.Program[];
  cohortRules: Types.CohortRule[];
  cohorts: Types.Cohort[];
  sessionTemplates: Types.SessionTemplate[];
  rateCards: Types.RateCard[];
  discountRules: Types.DiscountRule[];
  vatConfigs: Types.VatConfig[];
  families: Types.Family[];
  students: Types.Student[];
  registrations: Types.Registration[];
  invoices: Types.Invoice[];
  payments: Types.Payment[];
  sessionEnrollments: Types.SessionEnrollment[];
  attendances: Types.Attendance[];
  waitlistEntries: Types.WaitlistEntry[];
  users: Types.User[];
  coachAssignments: Types.CoachAssignment[];
  enquiries: Types.Enquiry[];
  currentUser: Types.User | null;
  selectedSeasonId: string; // 'all' or a real Season.id - the single source of truth every page reads from

  // Generic action helpers can be added here, or we can just define specific ones if needed.
  // We'll expose a generic way to update collections to save space, but provide specific getters/setters as requested.
  setCollection: <K extends keyof DataState>(key: K, data: DataState[K]) => void;
  setCurrentUser: (userId: string | null) => void;
  setSelectedSeasonId: (seasonId: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  organizations: mock.mockOrganizations,
  locations: mock.mockLocations,
  pitches: mock.mockPitches,
  seasons: mock.mockSeasons,
  terms: mock.mockTerms,
  programs: mock.mockPrograms,
  cohortRules: mock.mockCohortRules,
  cohorts: mock.mockCohorts,
  sessionTemplates: mock.mockSessionTemplates,
  rateCards: mock.mockRateCards,
  discountRules: mock.mockDiscountRules,
  vatConfigs: mock.mockVatConfigs,
  families: mock.mockFamilies,
  students: mock.mockStudents,
  registrations: mock.mockRegistrations,
  invoices: mock.mockInvoices,
  payments: mock.mockPayments,
  sessionEnrollments: mock.mockSessionEnrollments,
  attendances: mock.mockAttendances,
  waitlistEntries: mock.mockWaitlistEntries,
  users: mock.mockUsers,
  coachAssignments: mock.mockCoachAssignments,
  enquiries: mock.mockEnquiries,
  currentUser: mock.mockUsers[0] || null,
  selectedSeasonId: mock.mockSeasons[mock.mockSeasons.length - 1]?.id ?? 'all',

  setCollection: (key, data) => set({ [key]: data } as any),
  setCurrentUser: (userId) => set((state) => ({ currentUser: state.users.find(u => u.id === userId) || null })),
  setSelectedSeasonId: (seasonId) => set({ selectedSeasonId: seasonId }),
}));

// Helper to create CRUD actions for a specific entity type
function createActions<T extends { id: string }, K extends keyof DataState>(collectionKey: K) {
  return {
    getAll: (): T[] => useDataStore.getState()[collectionKey] as any,
    getById: (id: string): T | undefined => {
      const items = useDataStore.getState()[collectionKey] as any as T[];
      return items.find((item) => item.id === id);
    },
    add: (item: T) => {
      const state = useDataStore.getState();
      const items = state[collectionKey] as any as T[];
      state.setCollection(collectionKey, [...items, item] as any);
    },
    update: (id: string, updates: Partial<T>) => {
      const state = useDataStore.getState();
      const items = state[collectionKey] as any as T[];
      state.setCollection(collectionKey, items.map((item) => (item.id === id ? { ...item, ...updates } : item)) as any);
    },
    delete: (id: string) => {
      const state = useDataStore.getState();
      const items = state[collectionKey] as any as T[];
      state.setCollection(collectionKey, items.filter((item) => item.id !== id) as any);
    },
  };
}

export const OrganizationActions = createActions<Types.Organization, 'organizations'>('organizations');
export const LocationActions = createActions<Types.Location, 'locations'>('locations');
export const PitchActions = createActions<Types.Pitch, 'pitches'>('pitches');
export const SeasonActions = createActions<Types.Season, 'seasons'>('seasons');
export const TermActions = createActions<Types.Term, 'terms'>('terms');
export const ProgramActions = createActions<Types.Program, 'programs'>('programs');
export const CohortRuleActions = createActions<Types.CohortRule, 'cohortRules'>('cohortRules');
export const CohortActions = createActions<Types.Cohort, 'cohorts'>('cohorts');
export const SessionTemplateActions = createActions<Types.SessionTemplate, 'sessionTemplates'>('sessionTemplates');
export const RateCardActions = createActions<Types.RateCard, 'rateCards'>('rateCards');
export const DiscountRuleActions = createActions<Types.DiscountRule, 'discountRules'>('discountRules');
export const VatConfigActions = createActions<Types.VatConfig, 'vatConfigs'>('vatConfigs');
export const FamilyActions = createActions<Types.Family, 'families'>('families');
export const StudentActions = createActions<Types.Student, 'students'>('students');
export const RegistrationActions = createActions<Types.Registration, 'registrations'>('registrations');
export const InvoiceActions = createActions<Types.Invoice, 'invoices'>('invoices');
export const PaymentActions = createActions<Types.Payment, 'payments'>('payments');
export const SessionEnrollmentActions = createActions<Types.SessionEnrollment, 'sessionEnrollments'>('sessionEnrollments');
export const AttendanceActions = createActions<Types.Attendance, 'attendances'>('attendances');
export const WaitlistEntryActions = createActions<Types.WaitlistEntry, 'waitlistEntries'>('waitlistEntries');
export const UserActions = createActions<Types.User, 'users'>('users');
export const CoachAssignmentActions = createActions<Types.CoachAssignment, 'coachAssignments'>('coachAssignments');
export const EnquiryActions = createActions<Types.Enquiry, 'enquiries'>('enquiries');
