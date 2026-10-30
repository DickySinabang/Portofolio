import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Remove rendered components after every test.
afterEach(() => {
  cleanup()
})

// jsdom does not implement these browser features, but our components use them.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
vi.stubGlobal('IntersectionObserver', MockObserver)
vi.stubGlobal('ResizeObserver', MockObserver)

Object.defineProperty(window, 'scrollTo', { writable: true, value: vi.fn() })
Element.prototype.scrollIntoView = vi.fn()