/**
 * Error handling utilities for parsing contract revert messages
 * and displaying user-friendly error messages
 */

interface ContractError {
  message: string
  code?: string
  reason?: string
}

/**
 * Map of contract error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  // CreditLine errors
  KYC: 'KYC verification required. Please complete attestation before requesting a loan.',
  ACTIVE: 'You already have an active loan. Repay your current loan before requesting a new one.',
  RANGE: 'Loan amount is outside the allowed range. Check minimum and maximum principal limits.',
  RATE: 'Invalid interest rate. Please use the platform rate.',
  TERM: 'Invalid loan term. Choose 4, 8, or 12 weeks.',
  GROUP: 'Group is not active or does not exist.',
  APPROVALS: 'Insufficient loan approvals. Ask your group members to approve your loan request.',
  EXPOSURE: 'Group exposure limit exceeded. The group has too many outstanding loans.',
  DEFAULT: 'This loan has been marked as default.',
  PAID: 'This loan has already been fully repaid.',
  GRACE: 'Grace period has not expired yet.',
  SENDER: 'Only the borrower can perform this action.',
  WEEKS: 'Invalid reschedule duration. Must be between 1-12 weeks.',

  // SavingsPool errors
  AMOUNT: 'Invalid amount. Must be greater than zero.',
  BALANCE: 'Insufficient balance.',

  // GroupVault errors
  SIZE: 'Invalid group size. Must have 5-8 members.',
  MINAPP: 'Invalid minimum approvals. Must be between 3 and group size.',
  MEMBER: 'You are not a member of this group.',
  STAKE: 'Insufficient stake locked.',

  // Common errors
  'insufficient funds': 'Insufficient funds in your wallet.',
  'user rejected': 'Transaction was rejected by user.',
  'execution reverted': 'Transaction failed. Please check the parameters and try again.',
}

/**
 * Parse a contract error and return a user-friendly message
 */
export function parseContractError(error: any): string {
  if (!error) return 'An unknown error occurred'

  // Extract error message
  let errorMessage = error.message || error.toString()

  // Check for specific revert reasons
  const revertMatch = errorMessage.match(/reverted with reason string '([^']+)'/)
  if (revertMatch) {
    const reason = revertMatch[1]
    return ERROR_MESSAGES[reason] || `Transaction failed: ${reason}`
  }

  // Check for custom error names
  const customErrorMatch = errorMessage.match(/reverted with custom error '([^']+)'/)
  if (customErrorMatch) {
    const errorName = customErrorMatch[1]
    return ERROR_MESSAGES[errorName] || `Transaction failed: ${errorName}`
  }

  // Check for common error patterns
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }

  // Check for specific error codes
  if (error.code === 'INSUFFICIENT_FUNDS' || errorMessage.includes('insufficient funds')) {
    return ERROR_MESSAGES['insufficient funds']
  }

  if (error.code === 'ACTION_REJECTED' || errorMessage.includes('user rejected')) {
    return ERROR_MESSAGES['user rejected']
  }

  // Handle network errors
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return 'Network error. Please check your connection and try again.'
  }

  // Return generic error if no specific match
  return 'Transaction failed. Please try again or contact support if the issue persists.'
}

/**
 * Format error for display in UI
 */
export function formatErrorForDisplay(error: any): {
  title: string
  message: string
  details?: string
} {
  const userMessage = parseContractError(error)
  const technicalDetails = error.message || error.toString()

  return {
    title: 'Transaction Failed',
    message: userMessage,
    details: technicalDetails !== userMessage ? technicalDetails : undefined,
  }
}

/**
 * Check if error is a user rejection
 */
export function isUserRejection(error: any): boolean {
  if (!error) return false
  const message = error.message || error.toString()
  return (
    error.code === 'ACTION_REJECTED' ||
    message.includes('user rejected') ||
    message.includes('User denied')
  )
}

/**
 * Check if error is an insufficient funds error
 */
export function isInsufficientFunds(error: any): boolean {
  if (!error) return false
  const message = error.message || error.toString()
  return (
    error.code === 'INSUFFICIENT_FUNDS' ||
    message.toLowerCase().includes('insufficient funds') ||
    message.toLowerCase().includes('insufficient balance')
  )
}
