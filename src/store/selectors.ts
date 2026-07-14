import { useDataStore } from './dataStore';

// Selector: get locations the current user is scoped to
// (superAdmin/financeOfficer get all locations, others get only their scope)
export function selectUserLocations() {
  const { currentUser, locations } = useDataStore.getState();
  if (!currentUser) return [];
  if (currentUser.locationScope.length === 0) return locations; // all locations
  return locations.filter((l) => currentUser.locationScope.includes(l.id));
}

// Selector: get students at the current user's scoped locations
export function selectScopedStudents() {
  const { currentUser, students } = useDataStore.getState();
  if (!currentUser) return [];
  if (currentUser.locationScope.length === 0) return students; // all
  return students.filter((s) => currentUser.locationScope.includes(s.locationId));
}

// Selector: get registrations for students in the current user's location scope
export function selectScopedRegistrations() {
  const scopedStudentIds = selectScopedStudents().map((s) => s.id);
  const { registrations } = useDataStore.getState();
  return registrations.filter((r) => scopedStudentIds.includes(r.studentId));
}

// Selector: get registrations for the current user's family (parent role)
export function selectFamilyRegistrations() {
  const { currentUser, students, registrations } = useDataStore.getState();
  if (!currentUser?.familyId) return [];
  const familyStudentIds = students
    .filter((s) => s.familyId === currentUser.familyId)
    .map((s) => s.id);
  return registrations.filter((r) => familyStudentIds.includes(r.studentId));
}

// Selector: get students for the current user's family
export function selectFamilyStudents() {
  const { currentUser, students } = useDataStore.getState();
  if (!currentUser?.familyId) return [];
  return students.filter((s) => s.familyId === currentUser.familyId);
}

// Selector: get sessions (session templates) for the current user's location scope
export function selectScopedSessionTemplates() {
  const { currentUser, sessionTemplates, locations } =
    useDataStore.getState();
  if (!currentUser) return [];
  const scopedLocationIds =
    currentUser.locationScope.length > 0
      ? currentUser.locationScope
      : locations.map((l) => l.id);

  // sessionTemplates -> cohorts -> cohortRules -> programs (no direct locationId)
  // We filter via pitches -> location
  const { pitches } = useDataStore.getState();
  const scopedPitchIds = pitches
    .filter((p) => scopedLocationIds.includes(p.locationId))
    .map((p) => p.id);

  return sessionTemplates.filter((st) => scopedPitchIds.includes(st.pitchId));
}

// Selector: get invoices scoped to the current user's context
export function selectScopedInvoices() {
  const scopedRegistrationIds = selectScopedRegistrations().map((r) => r.id);
  const { invoices } = useDataStore.getState();
  return invoices.filter((inv) => scopedRegistrationIds.includes(inv.registrationId));
}

// Selector: get SessionTemplates assigned to the current coach user
export function selectCoachSessions() {
  const { currentUser, coachAssignments, sessionTemplates } = useDataStore.getState();
  if (!currentUser || currentUser.role !== 'coach') return [];
  const assignedIds = coachAssignments
    .filter((ca) => ca.coachUserId === currentUser.id)
    .map((ca) => ca.sessionTemplateId);
  return sessionTemplates.filter((st) => assignedIds.includes(st.id));
}

// ─────────────────────────────────────────────────────────────────────────
// Season-aware selectors. Season only has a direct link to Term - everything
// else (Registration, Invoice, Payment, a Student's registration history) is
// season-scoped indirectly, through whichever Term a Registration points at.
// These helpers are the single place that logic lives, so every page filters
// registrations/invoices/students the same way instead of re-deriving it.
// ─────────────────────────────────────────────────────────────────────────

// Terms belonging to the currently selected season ('all' = every term)
export function selectTermsForSelectedSeason() {
  const { terms, selectedSeasonId } = useDataStore.getState();
  if (selectedSeasonId === 'all') return terms;
  return terms.filter((t) => t.seasonId === selectedSeasonId);
}

// Filter any list of Registrations (or Registration-like objects with a termId)
// down to the selected season. Pass in an already-scoped list (e.g.
// selectScopedRegistrations()) to compose season filtering with location/family scoping.
export function filterRegistrationsBySelectedSeason<T extends { termId: string }>(registrations: T[]): T[] {
  const { selectedSeasonId } = useDataStore.getState();
  if (selectedSeasonId === 'all') return registrations;
  const termIds = new Set(selectTermsForSelectedSeason().map((t) => t.id));
  return registrations.filter((r) => termIds.has(r.termId));
}

// Student IDs that have at least one Registration in the selected season
export function selectStudentIdsInSelectedSeason(): Set<string> {
  const { registrations } = useDataStore.getState();
  const seasonRegs = filterRegistrationsBySelectedSeason(registrations);
  return new Set(seasonRegs.map((r) => r.studentId));
}
