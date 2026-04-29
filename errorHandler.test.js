import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { withErrorHandling } from './errorHandler.js'

describe('withErrorHandling', () => {
  let mockExit
  let mockConsoleError

  beforeEach(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    mockExit.mockRestore()
    mockConsoleError.mockRestore()
  })

  it('should call the original handler when no error occurs', async () => {
    const handler = jest.fn()
    const wrapped = withErrorHandling(handler)
    await wrapped({ test: true })
    expect(handler).toHaveBeenCalledWith({ test: true })
    expect(mockExit).not.toHaveBeenCalled()
  })

  it('should catch errors and display a friendly message', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('Something went wrong'))
    const wrapped = withErrorHandling(handler)
    await wrapped({})
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Something went wrong')
    )
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('should sanitize API tokens from error messages', async () => {
    const error = new Error(
      'Request failed: Basic YTQyOTk3YzEyZjExMTI4OTM0NGNlZDdlYWVkMmM6YXBpX3Rva2Vu'
    )
    const handler = jest.fn().mockRejectedValue(error)
    const wrapped = withErrorHandling(handler)
    await wrapped({})

    const errorOutput = mockConsoleError.mock.calls[0][0]
    expect(errorOutput).not.toContain('YTQyOTk3')
    expect(errorOutput).toContain('[REDACTED]')
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('should handle errors with no message', async () => {
    const handler = jest.fn().mockRejectedValue(new Error())
    const wrapped = withErrorHandling(handler)
    await wrapped({})
    expect(mockConsoleError).toHaveBeenCalled()
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
