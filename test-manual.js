import { generateDateRange } from './utils.js';

// Test the specific requirement: July 10 - August 12, 2025 should generate 34 days
console.log('Testing generateDateRange with requirement dates...');

try {
  const result = generateDateRange('2025-07-10', '2025-08-12');
  
  console.log(`Generated ${result.length} dates`);
  console.log(`First date: ${result[0].format('YYYY-MM-DD')}`);
  console.log(`Last date: ${result[result.length - 1].format('YYYY-MM-DD')}`);
  
  // Verify it's exactly 34 days as required
  if (result.length === 34) {
    console.log('✅ Correct number of days generated (34 days)');
  } else {
    console.log(`❌ Expected 34 days, got ${result.length}`);
  }
  
  // Show first few and last few dates
  console.log('\nFirst 5 dates:');
  result.slice(0, 5).forEach((date, index) => {
    console.log(`  ${index + 1}: ${date.format('YYYY-MM-DD dddd')}`);
  });
  
  console.log('\nLast 5 dates:');
  result.slice(-5).forEach((date, index) => {
    console.log(`  ${result.length - 4 + index}: ${date.format('YYYY-MM-DD dddd')}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}