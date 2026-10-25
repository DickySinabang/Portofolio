import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * React Router changes the URL for "/#about" but does not scroll to it.
 * This component does the scrolling, and resets to the top on other pages.
 */
export function ScrollToHash() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])

  return null
}