// Integration test to verify makeScheduledCommits works in the main execution context
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import { makeScheduledCommits } from "./utils.js";

console.log("Integration test: Testing makeScheduledCommits in main execution context...");

// Test with a single day and 1 commit to verify integration
try {
  console.log("Testing with single day, single commit...");
  makeScheduledCommits("2025-07-15", "2025-07-15", 1);
} catch (error) {
  console.error("Integration test failed:", error.message);
}