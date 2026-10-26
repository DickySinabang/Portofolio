import { useEffect } from 'react'

type DocumentMeta = {
  title: string
  description: string
  /** Asks search engines not to list the page (used for "not found" pages). */
  noindex?: boolean
}

function setMetaDescription(content: string) {
  let element = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!element) {
    element = document.createElement('meta')
    element.name = 'description'
    document.head.appendChild(element)
  }
  element.content = content
}

/** Sets the browser tab title and meta description for the current page. */
export function useDocumentMeta({ title, description, noindex = false }: DocumentMeta) {
  useEffect(() => {
    document.title = title
    setMetaDescription(description)
  }, [title, description])

  useEffect(() => {
    if (!noindex) return

    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)

    // The cleanup removes the tag again when the visitor leaves this page.
    return () => robots.remove()
  }, [noindex])
}