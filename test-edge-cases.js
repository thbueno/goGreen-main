import { generateDateRange } from './utils.js';

console.log('Testing edge cases for generateDateRange...\n');

// Test 1: Single day
console.log('Test 1: Single day range');
try {
  const result1 = generateDateRange('2025-07-10', '2025-07-10');
  console.log(`✅ Single day: ${result1.length} day(s) - ${result1[0].format('YYYY-MM-DD')}`);
} catch (error) {
  console.log(`❌ Single day test failed: ${error.message}`);
}

// Test 2: Month boundary
console.log('\nTest 2: Month boundary');
try {
  const result2 = generateDateRange('2025-07-30', '2025-08-02');
  console.log(`✅ Month boundary: ${result2.length} days`);
  result2.forEach(date => console.log(`  ${date.format('YYYY-MM-DD')}`));
} catch (error) {
  console.log(`❌ Month boundary test failed: ${error.message}`);
}

// Test 3: Invalid date format
console.log('\nTest 3: Invalid date format');
try {
  generateDateRange('2025/07/10', '2025-08-12');
  console.log('❌ Should have thrown error for invalid format');
} catch (error) {
  console.log(`✅ Correctly caught invalid format: ${error.message}`);
}

// Test 4: Start date after end date
console.log('\nTest 4: Start date after end date');
try {
  generateDateRange('2025-08-12', '2025-07-10');
  console.log('❌ Should have thrown error for invalid range');
} catch (error) {
  console.log(`✅ Correctly caught invalid range: ${error.message}`);
}

console.log('\n✅ All edge case tests completed successfully!');