import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RotatingTextProps = {
  prefix: string
  words: string[]
}

/** Types and deletes each word in turn. Shows a static list with reduced motion. */
export function RotatingText({ prefix, words }: RotatingTextProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced || words.length === 0) return

    const word = words[index % words.length]
    const delay = deleting ? 35 : text === word ? 1600 : 70

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((current) => current + 1)
      } else {
        setText(
          deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1),
        )
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [reduced, words, index, text, deleting])

  if (words.length === 0) return null

  return (
    <p className="min-h-12 font-mono text-sm text-muted sm:min-h-6">
      <span>{prefix} </span>
      {reduced ? (
        <span className="text-foreground">{words.join(' · ')}</span>
      ) : (
        <>
          {/* Screen readers get the full list once, not letter by letter. */}
          <span className="sr-only">{words.join(', ')}</span>
          <span aria-hidden="true" className="text-foreground">
            {text}
          </span>
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-accent-2"
          />
        </>
      )}
    </p>
  )
}