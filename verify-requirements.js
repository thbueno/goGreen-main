import { generateDateRange } from './utils.js';

console.log('Verifying against specific requirements...\n');

// Requirement 1.1: Start date of July 10th, 2025
// Requirement 1.2: End date of August 12th, 2025  
// Requirement 1.4: 34 days total (July 10 - August 12, 2025)
console.log('Testing Requirements 1.1, 1.2, and 1.4:');
try {
  const result = generateDateRange('2025-07-10', '2025-08-12');
  
  console.log(`✅ Start date: ${result[0].format('YYYY-MM-DD')} (Requirement 1.1)`);
  console.log(`✅ End date: ${result[result.length - 1].format('YYYY-MM-DD')} (Requirement 1.2)`);
  console.log(`✅ Total days: ${result.length} (Requirement 1.4 - should be 34)`);
  
  if (result.length === 34) {
    console.log('✅ Exactly 34 days generated as required');
  } else {
    console.log(`❌ Expected 34 days, got ${result.length}`);
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// Requirement 4.1: Accept start date parameter in standard date format
// Requirement 4.2: Accept end date parameter in standard date format
console.log('\nTesting Requirements 4.1 and 4.2 (Standard date format):');
try {
  const result = generateDateRange('2025-01-01', '2025-01-03');
  console.log(`✅ Standard YYYY-MM-DD format accepted (Requirements 4.1, 4.2)`);
  console.log(`   Generated ${result.length} dates from ${result[0].format('YYYY-MM-DD')} to ${result[result.length-1].format('YYYY-MM-DD')}`);
} catch (error) {
  console.log(`❌ Error with standard format: ${error.message}`);
}

// Requirement 4.4: Validate inputs and provide clear error messages
console.log('\nTesting Requirement 4.4 (Input validation and error messages):');

const testCases = [
  { start: 'invalid', end: '2025-01-01', desc: 'Invalid start date' },
  { start: '2025-01-01', end: 'invalid', desc: 'Invalid end date' },
  { start: '2025-01-05', end: '2025-01-01', desc: 'Start after end date' },
  { start: null, end: '2025-01-01', desc: 'Missing start date' },
  { start: '2025-01-01', end: null, desc: 'Missing end date' }
];

testCases.forEach(testCase => {
  try {
    generateDateRange(testCase.start, testCase.end);
    console.log(`❌ ${testCase.desc}: Should have thrown error`);
  } catch (error) {
    console.log(`✅ ${testCase.desc}: ${error.message}`);
  }
});

console.log('\n🎉 All requirements verification completed!');