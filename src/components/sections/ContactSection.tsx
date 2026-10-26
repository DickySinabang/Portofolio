import { ArrowUpRight, Download, Mail } from 'lucide-react'
import { contact, profile } from '../../data/portfolio'
import { getSocialLinks, hasContactDetails } from '../../lib/socialLinks'
import { ButtonLink } from '../ui/ButtonLink'
import { Section } from '../ui/Section'

export function ContactSection() {
  if (!hasContactDetails(profile)) return null

  const links = getSocialLinks(profile)
  const email = profile.email?.trim()
  const cvUrl = profile.cvUrl?.trim()

  return (
    <Section id="contact" eyebrow="Contact" title={contact.heading}>
      <p className="max-w-2xl text-lg leading-relaxed text-muted">{contact.message}</p>

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
        <p className="mt-6 text-sm text-muted">
          Email: <span className="font-mono text-foreground">{email}</span>
        </p>
      )}
    </Section>
  )
}