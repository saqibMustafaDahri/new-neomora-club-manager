import type { Registration } from '../types';
import { useDataStore } from '../store/dataStore';

export interface FeeCalculationResult {
  weeksBilled: number;
  baseAmount: number;
  discountPct: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
}

export function calculateFee(registration: Registration): FeeCalculationResult {
  const state = useDataStore.getState();

  // 1. Fetch related entities
  const student = state.students.find(s => s.id === registration.studentId);
  const term = state.terms.find(t => t.id === registration.termId);
  const rateCard = state.rateCards.find(rc => rc.programId === registration.programId);
  const vatConfig = state.vatConfigs[0]; // Assuming only 1 active VAT config for simplicity

  if (!student || !term || !rateCard || !vatConfig) {
    throw new Error('Missing required entities to calculate fee');
  }

  // 2. Calculate Weeks Billed
  // Ideally this would be calculated from joinDate to endDate, but for simplicity
  // we'll just use totalWeeks if joinDate is before or equal to startDate, otherwise prorate roughly.
  let weeksBilled = term.totalWeeks;
  const joinDate = new Date(registration.joinDate);
  const startDate = new Date(term.startDate);
  
  if (joinDate > startDate) {
    const diffTime = Math.abs(new Date(term.endDate).getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    weeksBilled = Math.max(1, Math.ceil(diffDays / 7));
  }

  weeksBilled = Math.max(weeksBilled, rateCard.minBillableWeeks);

  // 3. Base Amount
  const baseAmount = (weeksBilled * rateCard.weeklyRate) + 
                     rateCard.registrationFee + 
                     (registration.kitOptIn ? rateCard.kitFee : 0);

  // 4. Determine Discounts
  let highestDiscountPct = 0;

  // 4a. Check Sibling Discount
  const familyStudents = state.students.filter(s => s.familyId === student.familyId);
  const familyStudentIds = familyStudents.map(s => s.id);
  
  const activeRegistrationsInFamily = state.registrations.filter(
    reg => familyStudentIds.includes(reg.studentId) && reg.status === 'active'
  );

  const siblingRule = state.discountRules.find(dr => dr.type === 'sibling' && dr.active);
  if (siblingRule && activeRegistrationsInFamily.length > 1) {
    highestDiscountPct = Math.max(highestDiscountPct, siblingRule.discountPct);
  }

  // 4b. Check Term Commitment Discount
  const committedWeeks = registration.commitmentTerms * term.totalWeeks;
  const termRules = state.discountRules.filter(dr => dr.type === 'term_commitment' && dr.active);
  
  for (const rule of termRules) {
    if (committedWeeks >= rule.minWeeks && (!rule.maxWeeks || committedWeeks <= rule.maxWeeks)) {
      highestDiscountPct = Math.max(highestDiscountPct, rule.discountPct);
    }
  }

  // 5. Calculate Discount Amount
  // Usually discount applies to the weekly rate portion, not reg fee or kit, 
  // but for simplicity we'll apply it to the tuition part (weeksBilled * weeklyRate)
  const tuitionAmount = weeksBilled * rateCard.weeklyRate;
  const discountAmount = (tuitionAmount * highestDiscountPct) / 100;

  const amountAfterDiscount = baseAmount - discountAmount;

  // 6. Calculate VAT
  const vatAmount = (amountAfterDiscount * vatConfig.rate) / 100;

  // 7. Total
  const total = amountAfterDiscount + vatAmount;

  return {
    weeksBilled,
    baseAmount,
    discountPct: highestDiscountPct,
    discountAmount,
    vatAmount,
    total
  };
}
