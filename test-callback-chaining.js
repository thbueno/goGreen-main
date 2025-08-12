import { makeScheduledCommits } from "./utils.js";

console.log("Testing callback chaining with a 3-day range...");

// Test with a small range to verify proper callback chaining
// This should create 3 days × 2 commits = 6 total commits
try {
  makeScheduledCommits("2025-07-10", "2025-07-12", 2);
} catch (error) {
  console.error("Error:", error.message);
}