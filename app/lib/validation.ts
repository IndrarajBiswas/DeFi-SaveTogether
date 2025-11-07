/**
 * Validation utilities for form inputs
 */

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validates if a value is within a specified range
 * @param value - The numeric value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns true if within range, false otherwise
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max
}

/**
 * Validates if a value is a positive integer
 * @param value - The string value to validate
 * @returns true if positive integer, false otherwise
 */
export function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && parseInt(value, 10) > 0
}

/**
 * Validates if a value is a multiple of step
 * @param value - The numeric value to validate
 * @param step - The step size
 * @returns true if multiple of step, false otherwise
 */
export function isMultipleOf(value: number, step: number): boolean {
  return value % step === 0
}
