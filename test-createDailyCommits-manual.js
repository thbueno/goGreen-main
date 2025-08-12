import { createDailyCommits } from './utils.js';

console.log('Testing createDailyCommits function...');

// Test with a simple scenario
const baseDate = '2025-07-10';
const commitsPerDay = 3;

console.log(`Creating ${commitsPerDay} commits for ${baseDate}...`);

createDailyCommits(baseDate, commitsPerDay, () => {
  console.log('All commits completed successfully!');
  console.log('Manual test passed.');
});