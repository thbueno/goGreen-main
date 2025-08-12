# Design Document

## Overview

This design enhances the goGreen project to support scheduled commit density over specific date ranges. The enhancement introduces a new function `makeScheduledCommits` that creates a specified number of commits per day between two dates, while maintaining compatibility with the existing architecture and Git operations.

The design leverages the existing moment.js date manipulation, simple-git operations, and jsonfile data persistence, but replaces the random date generation with deterministic date range iteration and controlled timestamp distribution.

## Architecture

### Current Architecture Analysis
The existing goGreen architecture follows a simple recursive pattern:
- `makeCommits(n)` recursively creates n commits with random dates
- Each commit updates `data.json` and uses Git operations via simple-git
- A single push operation occurs after all commits are created

### Enhanced Architecture
The new architecture maintains the same core principles but introduces:
- Date range iteration instead of random date selection
- Multiple commits per day with time distribution
- Deterministic commit scheduling based on user parameters

### Component Interaction Flow
```
User Parameters → Date Range Generator → Daily Commit Scheduler → Git Operations → Push
```

## Components and Interfaces

### 1. Date Range Generator
**Purpose:** Generate an array of dates between start and end dates

**Interface:**
```javascript
function generateDateRange(startDate, endDate) {
  // Returns: Array of moment objects representing each day in range
}
```

**Implementation Details:**
- Uses moment.js for date manipulation
- Iterates day by day from start to end date (inclusive)
- Returns array of moment objects for easy manipulation

### 2. Daily Commit Scheduler
**Purpose:** Create multiple commits for a single day with distributed timestamps

**Interface:**
```javascript
function createDailyCommits(baseDate, commitsPerDay, callback) {
  // Creates commitsPerDay commits for the given baseDate
  // Distributes timestamps across the 24-hour period
  // Calls callback when all daily commits are complete
}
```

**Implementation Details:**
- Generates random hours (0-23) and minutes (0-59) for each commit
- Ensures no duplicate timestamps within the same day
- Uses recursive pattern similar to existing `makeCommits` function
- Maintains data.json update and Git commit operations

### 3. Main Scheduler Function
**Purpose:** Orchestrate the entire scheduled commit process

**Interface:**
```javascript
function makeScheduledCommits(startDate, endDate, commitsPerDay) {
  // Main entry point for scheduled commit creation
  // Processes each day in the date range
  // Performs final push after all commits
}
```

**Implementation Details:**
- Generates date range using Date Range Generator
- Iterates through each date, calling Daily Commit Scheduler
- Maintains recursive callback pattern for asynchronous Git operations
- Performs single push operation after all commits are complete

## Data Models

### Enhanced Data Structure
The existing `data.json` structure remains unchanged:
```json
{
  "date": "2025-07-10T14:30:00+05:30"
}
```

### Internal Data Structures

**Date Range Array:**
```javascript
[
  moment("2025-07-10"),
  moment("2025-07-11"),
  // ... all dates in range
  moment("2025-08-12")
]
```

**Daily Commit Queue:**
```javascript
[
  {
    date: "2025-07-10T08:15:00+05:30",
    processed: false
  },
  {
    date: "2025-07-10T12:45:00+05:30", 
    processed: false
  }
  // ... 6 commits total for the day
]
```

## Error Handling

### Input Validation
- Validate start date is before end date
- Validate commits per day is a positive integer
- Validate date formats are parseable by moment.js
- Provide clear error messages for invalid inputs

### Git Operation Error Handling
- Maintain existing error handling patterns from current implementation
- Ensure partial failures don't corrupt the Git repository
- Log errors with context about which date/commit failed

### File System Error Handling
- Handle jsonfile write failures gracefully
- Ensure data.json corruption doesn't break the process
- Maintain atomic operations where possible

## Testing Strategy

### Unit Tests
1. **Date Range Generation Tests**
   - Test various date ranges (single day, multiple months, leap years)
   - Test edge cases (same start/end date, invalid ranges)
   - Verify correct number of dates generated

2. **Daily Commit Scheduling Tests**
   - Test timestamp distribution within 24-hour periods
   - Verify no duplicate timestamps for same day
   - Test various commits-per-day values (1, 6, 24)

3. **Integration Tests**
   - Test complete flow with mock Git operations
   - Verify data.json updates correctly for each commit
   - Test error scenarios and recovery

### Manual Testing Scenarios
1. **Basic Functionality**
   - Run with July 10 - August 12, 2025 date range
   - Verify exactly 204 commits created (34 days × 6 commits)
   - Check GitHub contribution graph shows expected pattern

2. **Edge Cases**
   - Single day range with multiple commits
   - Large date ranges with high commit density
   - Timezone boundary testing

### Performance Testing
- Test with various date ranges and commit densities
- Measure execution time for large commit volumes
- Verify memory usage remains reasonable

## Implementation Notes

### Backward Compatibility
- Existing `makeCommits` and `markCommit` functions remain unchanged
- New functionality is additive, not replacing existing features
- Same dependencies and ES module structure maintained

### Configuration Integration
The new function will be called at the bottom of index.js:
```javascript
// Replace existing makeCommits(100) with:
makeScheduledCommits("2025-07-10", "2025-08-12", 6);
```

### Timezone Considerations
- Use moment.js timezone handling consistently
- Maintain existing timezone behavior from current implementation
- Document timezone assumptions for users