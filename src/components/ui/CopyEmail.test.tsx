import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CopyEmail } from './CopyEmail'

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

afterEach(() => {
  // Not vi.unstubAllGlobals(): that would also remove the shared test-setup stubs.
  Reflect.deleteProperty(navigator, 'clipboard')
})

describe('CopyEmail', () => {
  it('copies the email address and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    render(<CopyEmail email="ada@example.com" />)

    fireEvent.click(screen.getByRole('button', { name: /copy email/i }))

    await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument())
    expect(writeText).toHaveBeenCalledWith('ada@example.com')
  })

  it('stays quiet when the clipboard is not available', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    stubClipboard(writeText)
    render(<CopyEmail email="ada@example.com" />)

    fireEvent.click(screen.getByRole('button', { name: /copy email/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(screen.getByText('Copy email')).toBeInTheDocument()
  })
})