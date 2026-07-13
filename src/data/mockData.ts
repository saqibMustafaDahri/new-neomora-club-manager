import type {
  Organization, Location, Pitch, Season, Term, Program, CohortRule, Cohort,
  SessionTemplate, RateCard, DiscountRule, VatConfig, Family, Student,
  Registration, Invoice, Payment, SessionEnrollment, Attendance, WaitlistEntry, User, CoachAssignment
} from '../types';

export const mockOrganizations: Organization[] = [
  { id: 'org_1', name: 'Neomora Club Manager' }
];

export const mockLocations: Location[] = [
  { id: 'loc_jeddah', name: 'Jeddah Hub', city: 'Jeddah' },
  { id: 'loc_riyadh', name: 'Riyadh Hub', city: 'Riyadh' }
];

export const mockPitches: Pitch[] = [
  { id: 'pitch_jeddah_1', locationId: 'loc_jeddah', name: 'Jeddah Main Pitch' },
  { id: 'pitch_jeddah_2', locationId: 'loc_jeddah', name: 'Jeddah Training Pitch' },
  { id: 'pitch_riyadh_1', locationId: 'loc_riyadh', name: 'Riyadh Main Pitch' },
  { id: 'pitch_riyadh_2', locationId: 'loc_riyadh', name: 'Riyadh Indoor Arena' }
];

export const mockSeasons: Season[] = [
  { id: 'season_25_26', name: '2025/2026', startDate: '2025-08-01', endDate: '2026-06-30' }
];

export const mockTerms: Term[] = [
  { id: 'term_1_jeddah', seasonId: 'season_25_26', locationId: 'loc_jeddah', termNo: 1, startDate: '2025-08-25', endDate: '2025-11-15', totalWeeks: 12 },
  { id: 'term_2_jeddah', seasonId: 'season_25_26', locationId: 'loc_jeddah', termNo: 2, startDate: '2025-11-20', endDate: '2026-02-28', totalWeeks: 14 },
  { id: 'term_3_jeddah', seasonId: 'season_25_26', locationId: 'loc_jeddah', termNo: 3, startDate: '2026-03-05', endDate: '2026-06-15', totalWeeks: 14 },

  { id: 'term_1_riyadh', seasonId: 'season_25_26', locationId: 'loc_riyadh', termNo: 1, startDate: '2025-08-25', endDate: '2025-11-15', totalWeeks: 12 },
  { id: 'term_2_riyadh', seasonId: 'season_25_26', locationId: 'loc_riyadh', termNo: 2, startDate: '2025-11-20', endDate: '2026-02-28', totalWeeks: 14 },
  { id: 'term_3_riyadh', seasonId: 'season_25_26', locationId: 'loc_riyadh', termNo: 3, startDate: '2026-03-05', endDate: '2026-06-15', totalWeeks: 14 },
];

export const mockPrograms: Program[] = [
  { id: 'prog_as', code: 'AS', name: 'Academy Squad', locationId: null },
  { id: 'prog_js', code: 'JS', name: 'Junior Squad', locationId: null }
];

export const mockCohortRules: CohortRule[] = [
  { id: 'rule_js_u8', programId: 'prog_js', type: 'birth_year_range', config: { min: 2017, max: 2018 }, sessionsPerWeek: 2, capacity: 20 },
  { id: 'rule_js_u10', programId: 'prog_js', type: 'birth_year_range', config: { min: 2015, max: 2016 }, sessionsPerWeek: 2, capacity: 20 },
  { id: 'rule_as_2014', programId: 'prog_as', type: 'birth_year_exact', config: { year: 2014 }, sessionsPerWeek: 3, capacity: 16 }
];

export const mockCohorts: Cohort[] = [
  { id: 'cohort_jeddah_u8', cohortRuleId: 'rule_js_u8', label: 'Jeddah U8 JS' },
  { id: 'cohort_jeddah_u10', cohortRuleId: 'rule_js_u10', label: 'Jeddah U10 JS' },
  { id: 'cohort_riyadh_2014', cohortRuleId: 'rule_as_2014', label: 'Riyadh 2014 AS' }
];

export const mockSessionTemplates: SessionTemplate[] = [
  { id: 'st_jeddah_u8_sun', cohortId: 'cohort_jeddah_u8', pitchId: 'pitch_jeddah_1', dayOfWeek: 0, startTime: '16:00', endTime: '17:00', capacity: 20 },
  { id: 'st_jeddah_u8_tue', cohortId: 'cohort_jeddah_u8', pitchId: 'pitch_jeddah_1', dayOfWeek: 2, startTime: '16:00', endTime: '17:00', capacity: 20 },
  { id: 'st_riyadh_2014_mon', cohortId: 'cohort_riyadh_2014', pitchId: 'pitch_riyadh_1', dayOfWeek: 1, startTime: '17:30', endTime: '19:00', capacity: 16 },
  { id: 'st_riyadh_2014_wed', cohortId: 'cohort_riyadh_2014', pitchId: 'pitch_riyadh_1', dayOfWeek: 3, startTime: '17:30', endTime: '19:00', capacity: 16 },
  { id: 'st_riyadh_2014_sat', cohortId: 'cohort_riyadh_2014', pitchId: 'pitch_riyadh_2', dayOfWeek: 6, startTime: '09:00', endTime: '10:30', capacity: 16 },
];

export const mockRateCards: RateCard[] = [
  { id: 'rc_js', programId: 'prog_js', weeklyRate: 150, kitFee: 250, registrationFee: 100, minBillableWeeks: 12, effectiveFrom: '2025-01-01', effectiveTo: null },
  { id: 'rc_as', programId: 'prog_as', weeklyRate: 220, kitFee: 300, registrationFee: 150, minBillableWeeks: 12, effectiveFrom: '2025-01-01', effectiveTo: null }
];

export const mockDiscountRules: DiscountRule[] = [
  { id: 'dr_sib_js', type: 'sibling', programId: 'prog_js', minWeeks: 1, maxWeeks: null, discountPct: 10, active: true },
  { id: 'dr_term_3_as', type: 'term_commitment', programId: 'prog_as', minWeeks: 36, maxWeeks: null, discountPct: 15, active: true }, // Full season discount
  { id: 'dr_promo', type: 'promo', programId: null, minWeeks: 12, maxWeeks: null, discountPct: 5, active: true }
];

export const mockVatConfigs: VatConfig[] = [
  { id: 'vat_current', rate: 15, effectiveFrom: '2020-07-01' }
];

export const mockFamilies: Family[] = [
  { id: 'fam_1', guardianName: 'Ahmed Al-Farsi', phonePrimary: '0501234567', phoneSecondary: null, email: 'ahmed@example.com' },
  { id: 'fam_2', guardianName: 'Sarah Smith', phonePrimary: '0557654321', phoneSecondary: '0509876543', email: 'sarah.s@example.com' },
  { id: 'fam_3', guardianName: 'Tariq Saeed', phonePrimary: '0561112233', phoneSecondary: null, email: 'tariq@example.com' },
  { id: 'fam_4', guardianName: 'Fatima Omar', phonePrimary: '0544445555', phoneSecondary: null, email: 'fatima.o@example.com' }
];

export const mockStudents: Student[] = [
  { id: 'stu_1', familyId: 'fam_1', name: 'Omar Al-Farsi', dob: '2017-05-12', locationId: 'loc_jeddah' }, // Sibling 1
  { id: 'stu_2', familyId: 'fam_1', name: 'Zaid Al-Farsi', dob: '2015-08-20', locationId: 'loc_jeddah' }, // Sibling 2
  { id: 'stu_3', familyId: 'fam_2', name: 'Leo Smith', dob: '2018-01-10', locationId: 'loc_jeddah' },
  { id: 'stu_4', familyId: 'fam_3', name: 'Sami Saeed', dob: '2014-11-05', locationId: 'loc_riyadh' },
  { id: 'stu_5', familyId: 'fam_4', name: 'Ali Omar', dob: '2014-02-15', locationId: 'loc_riyadh' }
];

export const mockRegistrations: Registration[] = [
  { id: 'reg_1', studentId: 'stu_1', programId: 'prog_js', termId: 'term_1_jeddah', cohortId: 'cohort_jeddah_u8', joinDate: '2025-08-20', commitmentTerms: 1, kitOptIn: true, status: 'active' },
  { id: 'reg_2', studentId: 'stu_2', programId: 'prog_js', termId: 'term_1_jeddah', cohortId: 'cohort_jeddah_u10', joinDate: '2025-08-20', commitmentTerms: 1, kitOptIn: true, status: 'active' },
  { id: 'reg_3', studentId: 'stu_3', programId: 'prog_js', termId: 'term_1_jeddah', cohortId: 'cohort_jeddah_u8', joinDate: '2025-09-01', commitmentTerms: 1, kitOptIn: false, status: 'active' },
  { id: 'reg_4', studentId: 'stu_4', programId: 'prog_as', termId: 'term_1_riyadh', cohortId: 'cohort_riyadh_2014', joinDate: '2025-08-15', commitmentTerms: 3, kitOptIn: true, status: 'active' },
  { id: 'reg_5', studentId: 'stu_5', programId: 'prog_as', termId: 'term_1_riyadh', cohortId: 'cohort_riyadh_2014', joinDate: '2025-08-22', commitmentTerms: 1, kitOptIn: true, status: 'waitlisted' }
];

export const mockInvoices: Invoice[] = [
  // reg_1: JS program, 12 weeks @ 150 = 1800, plus kit 250, reg fee 100. Base = 1800. Sibling discount (stu_1 and stu_2 active) = 10% of 1800 = 180.
  // 1800 - 180 = 1620. Total pre-vat = 1620 + 250 + 100 = 1970. Vat = 15% of 1970 = 295.5. Total = 2265.5
  { id: 'inv_1', registrationId: 'reg_1', baseAmount: 1800, discountPct: 10, discountAmount: 180, kitFee: 250, registrationFee: 100, vatAmount: 295.5, total: 2265.5 },
  // reg_2: Same math. Total = 2265.5
  { id: 'inv_2', registrationId: 'reg_2', baseAmount: 1800, discountPct: 10, discountAmount: 180, kitFee: 250, registrationFee: 100, vatAmount: 295.5, total: 2265.5 },
  // reg_4: AS program, 12 weeks, but committed to 3 terms (36 weeks approx? For this invoice, just 1 term). Let's say 1 term billed at a time, but gets 15% discount.
  // 12 weeks * 220 = 2640. 15% of 2640 = 396. Base = 2640. 2640 - 396 = 2244. + 300 + 150 = 2694. VAT = 15% of 2694 = 404.1. Total = 3098.1
  { id: 'inv_4', registrationId: 'reg_4', baseAmount: 2640, discountPct: 15, discountAmount: 396, kitFee: 300, registrationFee: 150, vatAmount: 404.1, total: 3098.1 }
];

export const mockPayments: Payment[] = [
  { id: 'pay_1', invoiceId: 'inv_1', amount: 2265.5, paidDate: '2025-08-21', bankRef: 'TRX-998811', method: 'bank_transfer', notes: null },
  { id: 'pay_2', invoiceId: 'inv_2', amount: 1000, paidDate: '2025-08-21', bankRef: 'TRX-998812', method: 'credit_card', notes: 'Partial payment' }, // Messy: Partial payment
  { id: 'pay_3', invoiceId: 'inv_4', amount: 3098.1, paidDate: '2025-08-16', bankRef: null, method: 'bank_transfer', notes: 'Missing bank ref' } // Messy: missing ref
];

export const mockSessionEnrollments: SessionEnrollment[] = [
  { id: 'se_1', registrationId: 'reg_1', sessionTemplateId: 'st_jeddah_u8_sun' },
  { id: 'se_2', registrationId: 'reg_1', sessionTemplateId: 'st_jeddah_u8_tue' },
  { id: 'se_3', registrationId: 'reg_4', sessionTemplateId: 'st_riyadh_2014_mon' },
  { id: 'se_4', registrationId: 'reg_4', sessionTemplateId: 'st_riyadh_2014_wed' },
  { id: 'se_5', registrationId: 'reg_4', sessionTemplateId: 'st_riyadh_2014_sat' }
];

export const mockAttendances: Attendance[] = [
  { id: 'att_1', sessionEnrollmentId: 'se_1', sessionDate: '2025-08-31', status: 'present' },
  { id: 'att_2', sessionEnrollmentId: 'se_3', sessionDate: '2025-09-01', status: 'absent' }
];

export const mockWaitlistEntries: WaitlistEntry[] = [
  { id: 'wl_1', studentId: 'stu_5', cohortId: 'cohort_riyadh_2014', requestedDate: '2025-08-10', position: 1, status: 'pending' }
];

export const mockUsers: User[] = [
  { id: 'usr_super', name: 'Admin Chief', email: 'admin@neomo.com', role: 'superAdmin', locationScope: [], familyId: null },
  { id: 'usr_loc_jeddah', name: 'Jeddah Manager', email: 'jeddah@neomo.com', role: 'locationManager', locationScope: ['loc_jeddah'], familyId: null },
  { id: 'usr_finance', name: 'Finance Lead', email: 'finance@neomo.com', role: 'financeOfficer', locationScope: [], familyId: null },
  { id: 'usr_coach_riyadh', name: 'Coach Tarek', email: 'tarek@neomo.com', role: 'coach', locationScope: ['loc_riyadh'], familyId: null },
  { id: 'usr_parent_1', name: 'Ahmed Al-Farsi', email: 'ahmed@example.com', role: 'parent', locationScope: [], familyId: 'fam_1' }
];

// Coach Tarek is assigned to all three Riyadh 2014 AS session slots
export const mockCoachAssignments: CoachAssignment[] = [
  { id: 'ca_1', coachUserId: 'usr_coach_riyadh', sessionTemplateId: 'st_riyadh_2014_mon' },
  { id: 'ca_2', coachUserId: 'usr_coach_riyadh', sessionTemplateId: 'st_riyadh_2014_wed' },
  { id: 'ca_3', coachUserId: 'usr_coach_riyadh', sessionTemplateId: 'st_riyadh_2014_sat' },
];
