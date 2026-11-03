import { ArrowUpRight, Download, Mail } from 'lucide-react'
import { contact, profile } from '../../data/portfolio'
import { getSocialLinks, hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Section } from '../ui/Section'

/** The finale: a "transmission" panel with signal rings pulsing outward. */
export function ContactSection() {
  if (!hasContactDetails(profile)) return null

  const links = getSocialLinks(profile)
  const cvUrl = profile.cvUrl?.trim()

  return (
    <Section id="contact" eyebrow="Contact" title={contact.heading}>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm sm:p-14">
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

          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-foreground sm:text-2xl">
            {contact.message}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
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
        </div>
      </div>
    </Section>
  )
}