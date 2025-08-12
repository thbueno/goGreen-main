import { describe, it, expect } from 'vitest';
import moment from 'moment';
import { generateDateRange } from './utils.js';

describe('generateDateRange', () => {
  it('should generate correct date range for single day', () => {
    const result = generateDateRange('2025-07-10', '2025-07-10');
    
    expect(result).toHaveLength(1);
    expect(result[0].format('YYYY-MM-DD')).toBe('2025-07-10');
  });

  it('should generate correct date range for multiple days', () => {
    const result = generateDateRange('2025-07-10', '2025-07-12');
    
    expect(result).toHaveLength(3);
    expect(result[0].format('YYYY-MM-DD')).toBe('2025-07-10');
    expect(result[1].format('YYYY-MM-DD')).toBe('2025-07-11');
    expect(result[2].format('YYYY-MM-DD')).toBe('2025-07-12');
  });

  it('should generate correct date range for the specified requirement (July 10 - August 12, 2025)', () => {
    const result = generateDateRange('2025-07-10', '2025-08-12');
    
    // Should be 34 days total (July 10-31: 22 days, August 1-12: 12 days)
    expect(result).toHaveLength(34);
    expect(result[0].format('YYYY-MM-DD')).toBe('2025-07-10');
    expect(result[result.length - 1].format('YYYY-MM-DD')).toBe('2025-08-12');
  });

  it('should handle month boundaries correctly', () => {
    const result = generateDateRange('2025-01-30', '2025-02-02');
    
    expect(result).toHaveLength(4);
    expect(result[0].format('YYYY-MM-DD')).toBe('2025-01-30');
    expect(result[1].format('YYYY-MM-DD')).toBe('2025-01-31');
    expect(result[2].format('YYYY-MM-DD')).toBe('2025-02-01');
    expect(result[3].format('YYYY-MM-DD')).toBe('2025-02-02');
  });

  it('should handle leap year correctly', () => {
    const result = generateDateRange('2024-02-28', '2024-03-01');
    
    expect(result).toHaveLength(3);
    expect(result[0].format('YYYY-MM-DD')).toBe('2024-02-28');
    expect(result[1].format('YYYY-MM-DD')).toBe('2024-02-29'); // Leap year
    expect(result[2].format('YYYY-MM-DD')).toBe('2024-03-01');
  });

  it('should return moment objects', () => {
    const result = generateDateRange('2025-07-10', '2025-07-11');
    
    expect(result).toHaveLength(2);
    expect(moment.isMoment(result[0])).toBe(true);
    expect(moment.isMoment(result[1])).toBe(true);
  });

  // Input validation tests
  it('should throw error for missing start date', () => {
    expect(() => generateDateRange(null, '2025-07-10')).toThrow('Both start date and end date are required');
  });

  it('should throw error for missing end date', () => {
    expect(() => generateDateRange('2025-07-10', null)).toThrow('Both start date and end date are required');
  });

  it('should throw error for invalid start date format', () => {
    expect(() => generateDateRange('invalid-date', '2025-07-10')).toThrow('Invalid start date format: invalid-date. Expected YYYY-MM-DD format');
  });

  it('should throw error for invalid end date format', () => {
    expect(() => generateDateRange('2025-07-10', 'invalid-date')).toThrow('Invalid end date format: invalid-date. Expected YYYY-MM-DD format');
  });

  it('should throw error when start date is after end date', () => {
    expect(() => generateDateRange('2025-07-15', '2025-07-10')).toThrow('Start date must be before or equal to end date');
  });

  it('should handle various invalid date formats', () => {
    expect(() => generateDateRange('07-10-2025', '2025-07-10')).toThrow('Invalid start date format');
    expect(() => generateDateRange('2025/07/10', '2025-07-10')).toThrow('Invalid start date format');
    expect(() => generateDateRange('2025-7-10', '2025-07-10')).toThrow('Invalid start date format');
  });

  it('should handle edge case of year boundaries', () => {
    const result = generateDateRange('2024-12-30', '2025-01-02');
    
    expect(result).toHaveLength(4);
    expect(result[0].format('YYYY-MM-DD')).toBe('2024-12-30');
    expect(result[1].format('YYYY-MM-DD')).toBe('2024-12-31');
    expect(result[2].format('YYYY-MM-DD')).toBe('2025-01-01');
    expect(result[3].format('YYYY-MM-DD')).toBe('2025-01-02');
  });
});