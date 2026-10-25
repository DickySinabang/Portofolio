import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { navItems, profile, site } from '../../data/portfolio'
import { getSectionPath } from '../../lib/navigation'
import { getSocialLinks } from '../../lib/socialLinks'
import { Container } from '../ui/Container'

export function Footer() {
  const year = new Date().getFullYear()
  const socialLinks = getSocialLinks(profile)

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-mono text-sm font-semibold">{site.brand}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{site.closingMessage}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-medium">Navigate</h2>
          <ul className="mt-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.sectionId}>
                <Link
                  to={getSectionPath(item.sectionId)}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {socialLinks.length > 0 && (
          <div>
            <h2 className="text-sm font-medium">Connect</h2>
            <ul className="mt-3 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                    {link.external && (
                      <>
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>

      <div className="border-t border-line">
        <Container className="py-6 text-sm text-muted">
          © {year} {profile.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  )
}