
// export interface Organization {
//   id: string;
//   name: string;
// }

// export interface Location {
//   id: string;
//   name: string;
//   city: string;
// }

// export interface Pitch {
//   id: string;
//   locationId: string;
//   name: string;
// }

// export interface Season {
//   id: string;
//   name: string;
//   startDate: string; // ISO date string
//   endDate: string;
// }

// export interface Term {
//   id: string;
//   seasonId: string;
//   locationId: string;
//   termNo: number;
//   startDate: string;
//   endDate: string;
//   totalWeeks: number;
// }

// export interface Program {
//   id: string;
//   code: string;
//   name: string;
//   locationId: string | null; // null = all locations
// }

// export interface CohortRule {
//   id: string;
//   programId: string;
//   type: 'birth_year_range' | 'birth_year_exact';
//   config: any; // e.g. { min: 2012, max: 2014 } or { year: 2014 }
//   sessionsPerWeek: number;
//   capacity: number;
// }

// export interface Cohort {
//   id: string;
//   cohortRuleId: string;
//   label: string; // e.g., "U8", "2014 JS"
// }

// export interface SessionTemplate {
//   id: string;
//   cohortId: string;
//   pitchId: string;
//   dayOfWeek: number; // 0 (Sun) to 6 (Sat)
//   startTime: string; // HH:mm format
//   endTime: string;
//   capacity: number;
// }

// export interface RateCard {
//   id: string;
//   programId: string;
//   weeklyRate: number;
//   kitFee: number;
//   registrationFee: number;
//   minBillableWeeks: number;
//   effectiveFrom: string;
//   effectiveTo: string | null;
// }

// export interface DiscountRule {
//   id: string;
//   type: 'term_commitment' | 'sibling' | 'promo';
//   programId: string | null;
//   minWeeks: number;
//   maxWeeks: number | null;
//   discountPct: number; // e.g. 5 for 5%
//   active: boolean;
// }

// export interface VatConfig {
//   id: string;
//   rate: number; // e.g. 15 for 15%
//   effectiveFrom: string;
// }

// export interface Family {
//   id: string;
//   guardianName: string;
//   phonePrimary: string;
//   phoneSecondary: string | null;
//   email: string;
// }

// export interface Student {
//   id: string;
//   familyId: string;
//   name: string;
//   dob: string;
//   locationId: string;
// }

// export interface Registration {
//   id: string;
//   studentId: string;
//   programId: string;
//   termId: string;
//   cohortId: string;
//   joinDate: string;
//   commitmentTerms: number; // number of terms committed for discount purposes
//   kitOptIn: boolean;
//   status: 'active' | 'waitlisted' | 'withdrawn';
// }

// export interface Invoice {
//   id: string;
//   registrationId: string;
//   baseAmount: number;
//   discountPct: number;
//   discountAmount: number;
//   kitFee: number;
//   registrationFee: number;
//   vatAmount: number;
//   total: number;
// }

// export interface Payment {
//   id: string;
//   invoiceId: string;
//   amount: number;
//   paidDate: string;
//   bankRef: string | null;
//   method: 'bank_transfer' | 'credit_card' | 'cash';
//   notes: string | null;
// }

// export interface SessionEnrollment {
//   id: string;
//   registrationId: string;
//   sessionTemplateId: string;
// }

// export interface Attendance {
//   id: string;
//   sessionEnrollmentId: string;
//   sessionDate: string; // ISO date
//   status: 'present' | 'absent' | 'excused';
// }

// export interface WaitlistEntry {
//   id: string;
//   studentId: string;
//   cohortId: string;
//   requestedDate: string;
//   position: number;
//   status: 'pending' | 'admitted' | 'cancelled';
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'superAdmin' | 'locationManager' | 'financeOfficer' | 'coach' | 'parent';
//   locationScope: string[]; // array of locationIds
//   familyId: string | null;
// }

// export type Role = User['role'];

// export interface CoachAssignment {
//   id: string;
//   coachUserId: string;
//   sessionTemplateId: string;
// }

// export interface Enquiry {
//   id: string;
//   channel: 'whatsapp' | 'email';
//   contactName: string;
//   phone: string | null;
//   email: string | null;
//   ageBand: string | null; // rough age-group grouping as recorded at first contact, e.g. "U6", "Girls"
//   locationId: string | null;
//   status: 'new' | 'contacted' | 'trial_booked' | 'converted' | 'closed';
//   receivedDate: string | null; // ISO date - null where the source didn't record one
//   notes: string | null;
//   history: { status: string; at: string }[]; // stage-change log, populated as changes happen in-session
// }

export interface Organization {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
}

export interface Pitch {
  id: string;
  locationId: string;
  name: string;
}

export interface Season {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string;
}

export interface Term {
  id: string;
  seasonId: string;
  locationId: string;
  termNo: number;
  startDate: string;
  endDate: string;
  totalWeeks: number;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  locationId: string | null; // null = all locations
}

export interface CohortRule {
  id: string;
  programId: string;
  type: 'birth_year_range' | 'birth_year_exact';
  config: any; // e.g. { min: 2012, max: 2014 } or { year: 2014 }
  sessionsPerWeek: number;
  capacity: number;
}

export interface Cohort {
  id: string;
  cohortRuleId: string;
  label: string; // e.g., "U8", "2014 JS"
}

export interface SessionTemplate {
  id: string;
  cohortId: string;
  pitchId: string;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  startTime: string; // HH:mm format
  endTime: string;
  capacity: number;
}

export interface RateCard {
  id: string;
  programId: string;
  weeklyRate: number;
  kitFee: number;
  registrationFee: number;
  minBillableWeeks: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface DiscountRule {
  id: string;
  type: 'term_commitment' | 'sibling' | 'promo';
  programId: string | null;
  minWeeks: number;
  maxWeeks: number | null;
  discountPct: number; // e.g. 5 for 5%
  active: boolean;
}

export interface VatConfig {
  id: string;
  rate: number; // e.g. 15 for 15%
  effectiveFrom: string;
}

export interface Family {
  id: string;
  guardianName: string;
  phonePrimary: string;
  phoneSecondary: string | null;
  email: string;
}

export interface Student {
  id: string;
  familyId: string;
  name: string;
  dob: string;
  locationId: string;
}

export interface Registration {
  id: string;
  studentId: string;
  programId: string;
  termId: string;
  cohortId: string;
  joinDate: string;
  commitmentTerms: number; // number of terms committed for discount purposes
  kitOptIn: boolean;
  status: 'active' | 'waitlisted' | 'withdrawn';
}

export interface Invoice {
  id: string;
  registrationId: string;
  baseAmount: number;
  discountPct: number;
  discountAmount: number;
  kitFee: number;
  registrationFee: number;
  vatAmount: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paidDate: string;
  bankRef: string | null;
  method: 'bank_transfer' | 'credit_card' | 'cash';
  notes: string | null;
}

export interface SessionEnrollment {
  id: string;
  registrationId: string;
  sessionTemplateId: string;
}

export interface Attendance {
  id: string;
  sessionEnrollmentId: string;
  sessionDate: string; // ISO date
  status: 'present' | 'absent' | 'excused';
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  cohortId: string;
  requestedDate: string;
  position: number;
  status: 'pending' | 'admitted' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superAdmin' | 'locationManager' | 'financeOfficer' | 'coach' | 'parent';
  locationScope: string[]; // array of locationIds
  familyId: string | null;
}

export type Role = User['role'];

export interface CoachAssignment {
  id: string;
  coachUserId: string;
  sessionTemplateId: string;
}

export interface Enquiry {
  id: string;
  channel: 'whatsapp' | 'email';
  contactName: string;
  phone: string | null;
  email: string | null;
  ageBand: string | null; // rough age-group grouping as recorded at first contact, e.g. "U6", "Girls"
  locationId: string | null;
  status: 'new' | 'contacted' | 'trial_booked' | 'converted' | 'closed';
  receivedDate: string | null; // ISO date - null where the source didn't record one
  notes: string | null;
  history: { status: string; at: string }[]; // stage-change log, populated as changes happen in-session
}

export interface RegistrationRequest {
  id: string;
  studentName: string;
  dob: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  locationId: string;
  programId: string;
  seasonId: string; // which season the applicant is applying for - set on the public form itself
  preferredCohortLabel: string; // applicant's stated preference - not authoritative, admin confirms on approval
  kitOptIn: boolean;
  message: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  resultingStudentId?: string; // set once approved and converted into a real Student/Registration
}

