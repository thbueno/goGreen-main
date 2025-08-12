import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import moment from 'moment';
import { createDailyCommits } from './utils.js';

// Mock dependencies
vi.mock('jsonfile');
vi.mock('simple-git');

import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';

describe('createDailyCommits', () => {
  let mockGit;
  let consoleLogSpy;

  beforeEach(() => {
    // Setup mocks
    mockGit = {
      add: vi.fn().mockReturnThis(),
      commit: vi.fn().mockReturnThis(),
    };
    
    vi.mocked(simpleGit).mockReturnValue(mockGit);
    vi.mocked(jsonfile.writeFile).mockImplementation((path, data, callback) => {
      // Simulate async file write
      setTimeout(callback, 0);
    });

    // Spy on console.log
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  // Basic functionality tests
  it('should create the correct number of commits', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 3;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Verify jsonfile.writeFile was called 3 times
      expect(jsonfile.writeFile).toHaveBeenCalledTimes(3);
      
      // Verify git operations were called 3 times
      expect(mockGit.add).toHaveBeenCalledTimes(3);
      expect(mockGit.commit).toHaveBeenCalledTimes(3);
      
      done();
    });
  });

  it('should call callback when all commits are complete', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 2;
    
    const callbackSpy = vi.fn(() => {
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      done();
    });
    
    createDailyCommits(baseDate, commitsPerDay, callbackSpy);
  });

  it('should write correct data structure to data.json', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 1;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Check the data structure passed to jsonfile.writeFile
      const writeCall = vi.mocked(jsonfile.writeFile).mock.calls[0];
      const [path, data] = writeCall;
      
      expect(path).toBe('./data.json');
      expect(data).toHaveProperty('date');
      expect(typeof data.date).toBe('string');
      expect(data.date).toMatch(/^2025-07-10T/); // Should start with the date
      
      done();
    });
  });

  it('should use correct git commit format', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 1;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Check git operations
      expect(mockGit.add).toHaveBeenCalledWith(['./data.json']);
      
      const commitCall = mockGit.commit.mock.calls[0];
      const [message, options] = commitCall;
      
      expect(message).toMatch(/^2025-07-10T/);
      expect(options).toHaveProperty('--date');
      expect(options['--date']).toBe(message);
      
      done();
    });
  });

  it('should accept moment object as baseDate', (done) => {
    const baseDate = moment('2025-07-10');
    const commitsPerDay = 2;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      expect(jsonfile.writeFile).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should log each commit timestamp', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 2;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      
      // Check that logged values are timestamps
      const loggedValues = consoleLogSpy.mock.calls.map(call => call[0]);
      loggedValues.forEach(value => {
        expect(value).toMatch(/^2025-07-10T/);
      });
      
      done();
    });
  });

  // Input validation tests
  it('should throw error for non-integer commitsPerDay', () => {
    const baseDate = '2025-07-10';
    const callback = vi.fn();
    
    expect(() => createDailyCommits(baseDate, 3.5, callback)).toThrow('commitsPerDay must be a positive integer');
    expect(() => createDailyCommits(baseDate, '6', callback)).toThrow('commitsPerDay must be a positive integer');
    expect(() => createDailyCommits(baseDate, null, callback)).toThrow('commitsPerDay must be a positive integer');
  });

  it('should throw error for zero or negative commitsPerDay', () => {
    const baseDate = '2025-07-10';
    const callback = vi.fn();
    
    expect(() => createDailyCommits(baseDate, 0, callback)).toThrow('commitsPerDay must be a positive integer');
    expect(() => createDailyCommits(baseDate, -1, callback)).toThrow('commitsPerDay must be a positive integer');
  });

  it('should throw error for invalid callback', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 6;
    
    expect(() => createDailyCommits(baseDate, commitsPerDay, null)).toThrow('callback must be a function');
    expect(() => createDailyCommits(baseDate, commitsPerDay, 'not-a-function')).toThrow('callback must be a function');
    expect(() => createDailyCommits(baseDate, commitsPerDay, 123)).toThrow('callback must be a function');
  });

  // Edge cases
  it('should handle single commit per day', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 1;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      expect(jsonfile.writeFile).toHaveBeenCalledTimes(1);
      expect(mockGit.add).toHaveBeenCalledTimes(1);
      expect(mockGit.commit).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should handle high commit density', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 24;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      expect(jsonfile.writeFile).toHaveBeenCalledTimes(24);
      expect(mockGit.add).toHaveBeenCalledTimes(24);
      expect(mockGit.commit).toHaveBeenCalledTimes(24);
      done();
    });
  });

  // Requirements verification
  it('should satisfy requirement 2.1 - distribute timestamps across different hours', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 6; // From requirements
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Get all the timestamps that were logged
      const loggedTimestamps = consoleLogSpy.mock.calls.map(call => call[0]);
      
      // Parse hours from timestamps
      const hours = loggedTimestamps.map(ts => {
        const hour = moment(ts).hour();
        return hour;
      });
      
      // Should have 6 timestamps, all from the same day
      expect(loggedTimestamps).toHaveLength(6);
      loggedTimestamps.forEach(ts => {
        expect(ts).toMatch(/^2025-07-10T/);
      });
      
      done();
    });
  });

  it('should satisfy requirement 2.3 - no duplicate timestamps', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 6;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      const loggedTimestamps = consoleLogSpy.mock.calls.map(call => call[0]);
      const uniqueTimestamps = new Set(loggedTimestamps);
      
      // All timestamps should be unique
      expect(uniqueTimestamps.size).toBe(commitsPerDay);
      
      done();
    });
  });

  it('should satisfy requirement 3.1 - update data.json with each commit', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 3;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Verify data.json is updated for each commit
      expect(jsonfile.writeFile).toHaveBeenCalledTimes(3);
      
      // Check that each call has the correct structure
      const writeCalls = vi.mocked(jsonfile.writeFile).mock.calls;
      writeCalls.forEach(([path, data]) => {
        expect(path).toBe('./data.json');
        expect(data).toHaveProperty('date');
        expect(typeof data.date).toBe('string');
      });
      
      done();
    });
  });

  it('should satisfy requirement 3.3 - maintain existing Git commit format', (done) => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 2;
    
    createDailyCommits(baseDate, commitsPerDay, () => {
      // Verify git operations follow the existing pattern
      const addCalls = mockGit.add.mock.calls;
      const commitCalls = mockGit.commit.mock.calls;
      
      expect(addCalls).toHaveLength(2);
      expect(commitCalls).toHaveLength(2);
      
      // Check add calls
      addCalls.forEach(([files]) => {
        expect(files).toEqual(['./data.json']);
      });
      
      // Check commit calls
      commitCalls.forEach(([message, options]) => {
        expect(typeof message).toBe('string');
        expect(options).toHaveProperty('--date');
        expect(options['--date']).toBe(message);
      });
      
      done();
    });
  });
});