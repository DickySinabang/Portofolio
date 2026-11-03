import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** Copies the address to the clipboard; the label switches to "Copied" for two seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // No clipboard access (older browser, insecure page): nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/70 px-2.5 py-1 text-xs transition-colors hover:border-accent"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5 text-accent-3" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}