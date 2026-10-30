import { describe, expect, it } from 'vitest'
import type { Profile } from '../types/portfolio'
import { getSocialLinks, hasContactDetails } from './socialLinks'

const base: Profile = { name: 'A', title: 'B' }

describe('getSocialLinks', () => {
  it('returns nothing when no contact details are set', () => {
    expect(getSocialLinks(base)).toEqual([])
    expect(getSocialLinks({ ...base, email: '', githubUrl: '   ' })).toEqual([])
  })

  it('builds links in a fixed order, only for filled fields', () => {
    const links = getSocialLinks({
      ...base,
      email: ' a@b.co ',
      githubUrl: 'https://github.com/x',
      linkedinUrl: 'https://linkedin.com/in/x',
    })

    expect(links.map((link) => link.id)).toEqual(['email', 'github', 'linkedin'])
    expect(links[0]).toMatchObject({ href: 'mailto:a@b.co', external: false })
    expect(links[1]).toMatchObject({ href: 'https://github.com/x', external: true })
  })
})

describe('hasContactDetails', () => {
  it('is false for an empty profile', () => {
    expect(hasContactDetails(base)).toBe(false)
  })

  it('is true when a link or a CV is provided', () => {
    expect(hasContactDetails({ ...base, githubUrl: 'https://github.com/x' })).toBe(true)
    expect(hasContactDetails({ ...base, cvUrl: '/cv/me.pdf' })).toBe(true)
  })
})