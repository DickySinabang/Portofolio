import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react'
import { contact, profile } from '../../data/portfolio'
import { getSocialLinks, hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Section } from '../ui/Section'

/** Copies the address to the clipboard; the label switches to "Copied" for two seconds. */
function CopyEmail({ email }: { email: string }) {
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
      // No clipboard access (older browser, insecure page): the address is still on screen.
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

/** The finale: a "transmission" panel with signal rings pulsing outward. */
export function ContactSection() {
  if (!hasContactDetails(profile)) return null

  const links = getSocialLinks(profile)
  const email = profile.email?.trim()
  const cvUrl = profile.cvUrl?.trim()

  return (
    <Section id="contact" eyebrow="Contact" title={contact.heading}>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm sm:p-10">
        {/* Decorative signal rings, expanding from the corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 -right-56 size-[30rem] sm:-top-32 sm:-right-32"
        >
          <span className="signal-ring" />
          <span className="signal-ring [animation-delay:-2s]" />
          <span className="signal-ring [animation-delay:-4s]" />
          <span className="absolute inset-[48.6%] rounded-full bg-accent-3 shadow-[0_0_1rem_var(--accent-3)]" />
        </div>

        <div className="relative">
          <p
            aria-hidden="true"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-accent-3 uppercase"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-3/60" />
              <span className="relative size-2 rounded-full bg-accent-3" />
            </span>
            Transmission · channel open
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
            {contact.message}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((link) => (
              <ButtonLink
                key={link.id}
                href={link.href}
                external={link.external}
                variant={link.id === 'email' ? 'primary' : 'secondary'}
              >
                {link.id === 'email' && <Mail aria-hidden="true" className="size-4" />}
                {link.label}
                {link.external && <ArrowUpRight aria-hidden="true" className="size-4" />}
              </ButtonLink>
            ))}

            {cvUrl && (
              <ButtonLink href={cvUrl} download variant="secondary">
                <Download aria-hidden="true" className="size-4" />
                Download CV
              </ButtonLink>
            )}
          </div>

          {/* Shown as text too, for visitors without a mail app set up. */}
          {email && (
            <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>
                Email: <span className="font-mono text-foreground">{email}</span>
              </span>
              <CopyEmail email={email} />
            </p>
          )}
        </div>
      </div>
    </Section>
  )
}
