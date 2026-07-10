import { useDataStore } from './store/dataStore';
import { calculateFee } from './lib/pricingEngine';

function testPricing() {
  console.log('--- Testing Pricing Engine ---');
  const state = useDataStore.getState();
  
  // Test Reg 1 (Sibling discount expected, no term discount)
  const reg1 = state.registrations.find(r => r.id === 'reg_1');
  if (reg1) {
    console.log('\nRegistration 1 (reg_1):');
    const fee1 = calculateFee(reg1);
    console.log(fee1);
  }

  // Test Reg 3 (No discounts expected)
  const reg3 = state.registrations.find(r => r.id === 'reg_3');
  if (reg3) {
    console.log('\nRegistration 3 (reg_3):');
    const fee3 = calculateFee(reg3);
    console.log(fee3);
  }

  // Test Reg 4 (Term commitment discount expected)
  const reg4 = state.registrations.find(r => r.id === 'reg_4');
  if (reg4) {
    console.log('\nRegistration 4 (reg_4):');
    const fee4 = calculateFee(reg4);
    console.log(fee4);
  }
}

testPricing();
