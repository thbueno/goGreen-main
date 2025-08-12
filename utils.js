import moment from "moment";
import jsonfile from "jsonfile";
import simpleGit from "simple-git";

/**
 * Generate an array of moment objects for each day in the specified range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Array of moment objects representing each day in range
 * @throws {Error} If dates are invalid or start date is after end date
 */
export const generateDateRange = (startDate, endDate) => {
  // Input validation
  if (!startDate || !endDate) {
    throw new Error("Both start date and end date are required");
  }

  const start = moment(startDate, "YYYY-MM-DD", true);
  const end = moment(endDate, "YYYY-MM-DD", true);

  // Validate date formats
  if (!start.isValid()) {
    throw new Error(`Invalid start date format: ${startDate}. Expected YYYY-MM-DD format`);
  }
  
  if (!end.isValid()) {
    throw new Error(`Invalid end date format: ${endDate}. Expected YYYY-MM-DD format`);
  }

  // Validate date range
  if (start.isAfter(end)) {
    throw new Error("Start date must be before or equal to end date");
  }

  // Generate date range
  const dateRange = [];
  const current = start.clone();

  while (current.isSameOrBefore(end, 'day')) {
    dateRange.push(current.clone());
    current.add(1, 'day');
  }

  return dateRange;
};

/**
 * Generate random timestamps for commits within a single day
 * @param {moment.Moment|string} baseDate - Base date (moment object or YYYY-MM-DD string)
 * @param {number} commitsPerDay - Number of commits to generate for the day
 * @returns {Array} Array of moment objects with random times within the day
 * @throws {Error} If commitsPerDay is not a positive integer or baseDate is invalid
 */
export const generateDailyTimestamps = (baseDate, commitsPerDay) => {
  // Validate commitsPerDay
  if (!Number.isInteger(commitsPerDay) || commitsPerDay <= 0) {
    throw new Error("commitsPerDay must be a positive integer");
  }

  // Handle baseDate input - accept both moment objects and strings
  let baseMoment;
  if (moment.isMoment(baseDate)) {
    baseMoment = baseDate.clone();
  } else if (typeof baseDate === 'string') {
    baseMoment = moment(baseDate, "YYYY-MM-DD", true);
    if (!baseMoment.isValid()) {
      throw new Error(`Invalid baseDate format: ${baseDate}. Expected YYYY-MM-DD format or moment object`);
    }
  } else {
    throw new Error("baseDate must be a moment object or YYYY-MM-DD string");
  }

  // Generate unique timestamps
  const timestamps = new Set();
  const results = [];

  // Generate random timestamps until we have the required number
  while (results.length < commitsPerDay) {
    const hour = Math.floor(Math.random() * 24); // 0-23
    const minute = Math.floor(Math.random() * 60); // 0-59
    const second = Math.floor(Math.random() * 60); // 0-59 for extra uniqueness
    
    // Create timestamp string for uniqueness check
    const timeKey = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    
    // Only add if we haven't seen this exact time before
    if (!timestamps.has(timeKey)) {
      timestamps.add(timeKey);
      
      // Create moment object with the random time
      const timestamp = baseMoment.clone()
        .hour(hour)
        .minute(minute)
        .second(second)
        .millisecond(0);
      
      results.push(timestamp);
    }
  }

  // Sort timestamps chronologically within the day
  results.sort((a, b) => a.valueOf() - b.valueOf());

  return results;
};

/**
 * Create multiple commits for a single day with distributed timestamps
 * @param {moment.Moment|string} baseDate - Base date (moment object or YYYY-MM-DD string)
 * @param {number} commitsPerDay - Number of commits to create for the day
 * @param {Function} callback - Callback function to call when all daily commits are complete
 * @throws {Error} If commitsPerDay is not a positive integer or baseDate is invalid
 */
export const createDailyCommits = (baseDate, commitsPerDay, callback) => {
  // Input validation
  if (!Number.isInteger(commitsPerDay) || commitsPerDay <= 0) {
    throw new Error("commitsPerDay must be a positive integer");
  }

  if (typeof callback !== 'function') {
    throw new Error("callback must be a function");
  }

  // Generate distributed timestamps for the day
  const timestamps = generateDailyTimestamps(baseDate, commitsPerDay);
  const path = "./data.json";

  // Recursive function to process each commit
  const processCommit = (index) => {
    // Base case: all commits processed
    if (index >= timestamps.length) {
      return callback();
    }

    // Get the current timestamp and format it
    const timestamp = timestamps[index];
    const dateString = timestamp.format();

    // Create data object
    const data = {
      date: dateString,
    };

    console.log(dateString);

    // Write to data.json and create commit
    jsonfile.writeFile(path, data, () => {
      simpleGit()
        .add([path])
        .commit(dateString, { "--date": dateString }, () => {
          // Recursively process next commit
          processCommit(index + 1);
        });
    });
  };

  // Start processing commits from index 0
  processCommit(0);
};

/**
 * Create scheduled commits over a date range with specified commits per day
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} commitsPerDay - Number of commits to create per day
 * @throws {Error} If parameters are invalid
 */
export const makeScheduledCommits = (startDate, endDate, commitsPerDay) => {
  // Input validation
  if (!startDate || !endDate) {
    throw new Error("Both start date and end date are required");
  }

  if (!Number.isInteger(commitsPerDay) || commitsPerDay <= 0) {
    throw new Error("commitsPerDay must be a positive integer");
  }

  // Generate date range
  const dateRange = generateDateRange(startDate, endDate);
  console.log(`Creating ${commitsPerDay} commits per day for ${dateRange.length} days (${dateRange.length * commitsPerDay} total commits)`);

  // Recursive function to process each date
  const processDate = (dateIndex) => {
    // Base case: all dates processed, perform final push
    if (dateIndex >= dateRange.length) {
      console.log("All commits created. Pushing to remote repository...");
      return simpleGit().push();
    }

    // Get current date
    const currentDate = dateRange[dateIndex];
    console.log(`Processing date: ${currentDate.format('YYYY-MM-DD')} (${dateIndex + 1}/${dateRange.length})`);

    // Create daily commits for current date
    createDailyCommits(currentDate, commitsPerDay, () => {
      // After daily commits are complete, process next date
      processDate(dateIndex + 1);
    });
  };

  // Start processing from the first date
  processDate(0);
};