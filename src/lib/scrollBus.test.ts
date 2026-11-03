import { afterEach, describe, expect, it, vi } from 'vitest'
import { subscribeScroll } from './scrollBus'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('subscribeScroll', () => {
  it('calls back at once, then once per frame however many scroll events fire', () => {
    const frames: FrameRequestCallback[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    const listener = vi.fn()
    const unsubscribe = subscribeScroll(listener)
    expect(listener).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(frames).toHaveLength(1)

    frames[0](0)
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it('shares a single window listener between subscribers and removes it when the last leaves', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')

    const first = subscribeScroll(() => {})
    const second = subscribeScroll(() => {})
    expect(add.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1)

    first()
    expect(remove.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(0)
    second()
    expect(remove.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1)
  })
})
