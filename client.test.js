import { describe, it, expect } from '@jest/globals'
import { sanitizeErrorMessage } from './client.js'

describe('sanitizeErrorMessage', () => {
  it('should strip Basic auth header values', () => {
    const input = 'Request failed: Basic YTQyOTk3YzEyZjExMTI4OTM0NGNlZDdlYWVkMmM6YXBpX3Rva2Vu'
    const result = sanitizeErrorMessage(input)
    expect(result).toBe('Request failed: Basic [REDACTED]')
    expect(result).not.toContain('YTQyOTk3')
  })

  it('should strip credentials from URLs', () => {
    const input = 'getaddrinfo ENOTFOUND at https://a42997c12f112821289344ced7eaed2c:api_token@api.track.toggl.com/api/v9/me'
    const result = sanitizeErrorMessage(input)
    expect(result).toContain('[REDACTED]@api.track.toggl.com')
    expect(result).not.toContain('a42997c12f112821289344ced7eaed2c')
  })

  it('should handle null/undefined input', () => {
    expect(sanitizeErrorMessage(null)).toBeNull()
    expect(sanitizeErrorMessage(undefined)).toBeUndefined()
    expect(sanitizeErrorMessage('')).toBe('')
  })

  it('should not modify messages without credentials', () => {
    const input = 'Connection timed out'
    expect(sanitizeErrorMessage(input)).toBe('Connection timed out')
  })
})
