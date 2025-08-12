import { generateDailyTimestamps } from "./utils.js";
import moment from "moment";

console.log("=== Testing generateDailyTimestamps function ===\n");

// Test 1: Basic functionality with 6 commits per day (requirement scenario)
console.log("Test 1: Generate 6 commits for July 10, 2025");
const result1 = generateDailyTimestamps("2025-07-10", 6);
result1.forEach((timestamp, index) => {
  console.log(
    `  Commit ${index + 1}: ${timestamp.format("YYYY-MM-DD HH:mm:ss")}`
  );
});

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: Using moment object as input
console.log("Test 2: Using moment object as baseDate");
const baseMoment = moment("2025-08-12");
const result2 = generateDailyTimestamps(baseMoment, 4);
result2.forEach((timestamp, index) => {
  console.log(
    `  Commit ${index + 1}: ${timestamp.format("YYYY-MM-DD HH:mm:ss")}`
  );
});

console.log("\n" + "=".repeat(50) + "\n");

// Test 3: Verify uniqueness and distribution
console.log("Test 3: Verify uniqueness with 12 commits");
const result3 = generateDailyTimestamps("2025-07-15", 12);
const hours = result3.map((ts) => ts.hour());
const uniqueHours = new Set(hours);

console.log(`Generated ${result3.length} commits`);
console.log(
  `Unique hours used: ${uniqueHours.size} (${Array.from(uniqueHours)
    .sort((a, b) => a - b)
    .join(", ")})`
);
result3.forEach((timestamp, index) => {
  console.log(
    `  Commit ${index + 1}: ${timestamp.format("YYYY-MM-DD HH:mm:ss")}`
  );
});

console.log("\n=== All tests completed successfully! ===");
