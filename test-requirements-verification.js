import { generateDateRange } from "./utils.js";

// Verify the exact requirements from the spec
console.log("Verifying requirements for July 10 - August 12, 2025 with 6 commits per day...");

try {
  // Test date range calculation
  const dateRange = generateDateRange("2025-07-10", "2025-08-12");
  console.log(`Date range spans ${dateRange.length} days`);
  console.log(`Total commits would be: ${dateRange.length * 6}`);
  
  // Verify it matches the requirement of 34 days and 204 commits
  if (dateRange.length === 34) {
    console.log("✅ Date range is correct: 34 days");
  } else {
    console.log(`❌ Date range is incorrect: expected 34 days, got ${dateRange.length}`);
  }
  
  if (dateRange.length * 6 === 204) {
    console.log("✅ Total commits calculation is correct: 204 commits");
  } else {
    console.log(`❌ Total commits calculation is incorrect: expected 204, got ${dateRange.length * 6}`);
  }
  
  console.log(`First date: ${dateRange[0].format('YYYY-MM-DD')}`);
  console.log(`Last date: ${dateRange[dateRange.length - 1].format('YYYY-MM-DD')}`);
  
} catch (error) {
  console.error("Error:", error.message);
}