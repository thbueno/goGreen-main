import { describe, it, expect } from 'vitest';
import moment from 'moment';
import { generateDailyTimestamps } from './utils.js';

describe('generateDailyTimestamps', () => {
  // Basic functionality tests
  it('should generate correct number of timestamps', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 6;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    expect(result).toHaveLength(6);
  });

  it('should generate timestamps within the same day', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 5;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    result.forEach(timestamp => {
      expect(timestamp.format('YYYY-MM-DD')).toBe('2025-07-10');
      expect(timestamp.hour()).toBeGreaterThanOrEqual(0);
      expect(timestamp.hour()).toBeLessThan(24);
      expect(timestamp.minute()).toBeGreaterThanOrEqual(0);
      expect(timestamp.minute()).toBeLessThan(60);
    });
  });

  it('should return moment objects', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 3;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    result.forEach(timestamp => {
      expect(moment.isMoment(timestamp)).toBe(true);
    });
  });

  it('should accept moment object as baseDate', () => {
    const baseDate = moment('2025-07-10');
    const commitsPerDay = 4;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    expect(result).toHaveLength(4);
    result.forEach(timestamp => {
      expect(timestamp.format('YYYY-MM-DD')).toBe('2025-07-10');
    });
  });

  // Uniqueness tests
  it('should generate unique timestamps within the same day', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 10;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    // Convert to ISO strings for comparison
    const timestampStrings = result.map(ts => ts.toISOString());
    const uniqueTimestamps = new Set(timestampStrings);
    
    expect(uniqueTimestamps.size).toBe(commitsPerDay);
  });

  it('should handle high commit density without duplicates', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 24; // One per hour
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    expect(result).toHaveLength(24);
    
    // Check uniqueness
    const timestampStrings = result.map(ts => ts.toISOString());
    const uniqueTimestamps = new Set(timestampStrings);
    expect(uniqueTimestamps.size).toBe(24);
  });

  it('should handle single commit per day', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 1;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    expect(result).toHaveLength(1);
    expect(result[0].format('YYYY-MM-DD')).toBe('2025-07-10');
  });

  // Sorting tests
  it('should return timestamps sorted chronologically', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 8;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    // Check if sorted
    for (let i = 1; i < result.length; i++) {
      expect(result[i].valueOf()).toBeGreaterThanOrEqual(result[i - 1].valueOf());
    }
  });

  // Input validation tests
  it('should throw error for non-integer commitsPerDay', () => {
    const baseDate = '2025-07-10';
    
    expect(() => generateDailyTimestamps(baseDate, 3.5)).toThrow('commitsPerDay must be a positive integer');
    expect(() => generateDailyTimestamps(baseDate, '6')).toThrow('commitsPerDay must be a positive integer');
    expect(() => generateDailyTimestamps(baseDate, null)).toThrow('commitsPerDay must be a positive integer');
  });

  it('should throw error for zero or negative commitsPerDay', () => {
    const baseDate = '2025-07-10';
    
    expect(() => generateDailyTimestamps(baseDate, 0)).toThrow('commitsPerDay must be a positive integer');
    expect(() => generateDailyTimestamps(baseDate, -1)).toThrow('commitsPerDay must be a positive integer');
    expect(() => generateDailyTimestamps(baseDate, -10)).toThrow('commitsPerDay must be a positive integer');
  });

  it('should throw error for invalid baseDate string format', () => {
    const commitsPerDay = 6;
    
    expect(() => generateDailyTimestamps('invalid-date', commitsPerDay)).toThrow('Invalid baseDate format: invalid-date. Expected YYYY-MM-DD format or moment object');
    expect(() => generateDailyTimestamps('07-10-2025', commitsPerDay)).toThrow('Invalid baseDate format: 07-10-2025. Expected YYYY-MM-DD format or moment object');
    expect(() => generateDailyTimestamps('2025/07/10', commitsPerDay)).toThrow('Invalid baseDate format: 2025/07/10. Expected YYYY-MM-DD format or moment object');
  });

  it('should throw error for invalid baseDate type', () => {
    const commitsPerDay = 6;
    
    expect(() => generateDailyTimestamps(123, commitsPerDay)).toThrow('baseDate must be a moment object or YYYY-MM-DD string');
    expect(() => generateDailyTimestamps(null, commitsPerDay)).toThrow('baseDate must be a moment object or YYYY-MM-DD string');
    expect(() => generateDailyTimestamps(undefined, commitsPerDay)).toThrow('baseDate must be a moment object or YYYY-MM-DD string');
  });

  // Edge cases and requirements verification
  it('should work with different dates', () => {
    const dates = ['2025-01-01', '2025-12-31', '2024-02-29']; // Including leap year
    const commitsPerDay = 6;
    
    dates.forEach(date => {
      const result = generateDailyTimestamps(date, commitsPerDay);
      
      expect(result).toHaveLength(6);
      result.forEach(timestamp => {
        expect(timestamp.format('YYYY-MM-DD')).toBe(date);
      });
    });
  });

  it('should handle the specific requirement scenario (6 commits per day)', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 6; // From requirements
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    expect(result).toHaveLength(6);
    
    // Verify all timestamps are within the same day
    result.forEach(timestamp => {
      expect(timestamp.format('YYYY-MM-DD')).toBe('2025-07-10');
    });
    
    // Verify uniqueness
    const timestampStrings = result.map(ts => ts.toISOString());
    const uniqueTimestamps = new Set(timestampStrings);
    expect(uniqueTimestamps.size).toBe(6);
    
    // Verify chronological order
    for (let i = 1; i < result.length; i++) {
      expect(result[i].valueOf()).toBeGreaterThanOrEqual(result[i - 1].valueOf());
    }
  });

  // Distribution tests (statistical)
  it('should distribute timestamps across different hours', () => {
    const baseDate = '2025-07-10';
    const commitsPerDay = 24; // Enough to likely hit different hours
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    // Get unique hours
    const hours = result.map(ts => ts.hour());
    const uniqueHours = new Set(hours);
    
    // With 24 commits, we should get a reasonable distribution
    // This is probabilistic, but very likely to pass
    expect(uniqueHours.size).toBeGreaterThan(10);
  });

  it('should preserve timezone information from baseDate', () => {
    const baseDate = moment('2025-07-10').utcOffset('+05:30'); // India timezone
    const commitsPerDay = 3;
    
    const result = generateDailyTimestamps(baseDate, commitsPerDay);
    
    result.forEach(timestamp => {
      expect(timestamp.utcOffset()).toBe(baseDate.utcOffset());
    });
  });
});