import { expect, test } from '@playwright/test'

test.describe('cosmos hero', () => {
  test('has no social links and no developer.ts code card', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#home')
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()

    await expect(hero.getByRole('link', { name: /GitHub|LinkedIn/ })).toHaveCount(0)
    await expect(hero.locator('a[href^="mailto:"]')).toHaveCount(0)
    await expect(hero).not.toContainText('developer.ts')
    await expect(hero.getByRole('link')).toHaveCount(3) // projects, contact, CV
  })

  test('"Contact Me" lands on the one and only #contact section', async ({ page }) => {
    await page.goto('/')
    await page.locator('#home').getByRole('link', { name: 'Contact Me' }).click()

    await expect(page.locator('[id="contact"]')).toHaveCount(1)
    await expect
      .poll(async () => (await page.locator('#contact').boundingBox())?.y ?? Infinity, {
        message: 'the contact section should settle just below the navbar',
        timeout: 10_000,
      })
      .toBeLessThan(120)
    await expect(page).toHaveURL(/#contact$/)
  })

  test('"Contact Me" scrolls instantly with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.locator('#home').getByRole('link', { name: 'Contact Me' }).click()

    await expect(page).toHaveURL(/#contact$/)
    // Instant, so it settles within a couple of frames (the scroll runs after the route renders).
    await expect
      .poll(async () => (await page.locator('#contact').boundingBox())?.y ?? Infinity, {
        timeout: 3_000,
      })
      .toBeLessThan(120)
  })

  test('the planet falls back to CSS when WebGL is unavailable', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript(() => {
      const w = window as unknown as Record<string, unknown>
      delete w.WebGLRenderingContext
      delete w.WebGL2RenderingContext
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (/webgl/i.test(type)) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (original as any).call(this, type, ...rest)
      } as typeof original
    })

    await page.goto('/')
    const planet = page.locator('[data-planet]')
    await expect(planet).toHaveAttribute('data-planet', 'css')
    await expect(planet.locator('.planet-css')).toBeVisible()
    await page.waitForTimeout(2000) // long enough for the idle load to have been tried
    await expect(planet).toHaveAttribute('data-planet', 'css')
    expect(errors).toEqual([])
  })

  test('reduced motion keeps the static CSS planet', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForTimeout(2000)

    await expect(page.locator('[data-planet]')).toHaveAttribute('data-planet', 'css')
  })
})

test.describe('pinned, scroll-driven skills', () => {
  test('slides the cards sideways as you scroll down, then releases', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Phones get a touch-scrollable rail instead of the pinned track')
    await page.goto('/')
    const state = () =>
      page.evaluate(() => {
        const section = document.getElementById('skills')!
        const track = section.querySelector('[role="region"]') as HTMLElement
        return {
          tx: new DOMMatrix(getComputedStyle(track).transform).m41,
          heading: document.getElementById('skills-heading')!.getBoundingClientRect().top,
          height: section.getBoundingClientRect().height,
          top: section.getBoundingClientRect().top + window.scrollY,
          viewport: window.innerHeight,
        }
      })
    const scrollTo = async (top: number) => {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
      await page.waitForTimeout(300)
    }

    // The section measures its cards after it mounts, then grows to hold the pin.
    await page.waitForFunction(
      () => document.getElementById('skills')!.getBoundingClientRect().height > window.innerHeight + 300,
    )
    const start = await state()
    const travel = start.height - start.viewport
    expect(travel).toBeGreaterThan(300) // the section is taller than the screen: that is the pin

    await scrollTo(start.top)
    const pinned = await state()
    await scrollTo(start.top + travel / 2)
    const half = await state()
    await scrollTo(start.top + travel)
    const end = await state()

    expect(pinned.tx).toBeCloseTo(0, 0)
    expect(half.tx).toBeCloseTo(-travel / 2, -1) // progress follows the vertical scroll exactly
    expect(end.tx).toBeCloseTo(-travel, -1)
    expect(half.heading).toBeCloseTo(pinned.heading, 0) // the heading stays put while pinned

    await scrollTo(start.top + travel + 400) // past the last card: released, the page moves on
    const released = await state()
    expect(released.heading).toBeLessThan(end.heading - 300)

    await scrollTo(start.top + travel / 2) // and back up, to the same place
    expect((await state()).tx).toBeCloseTo(half.tx, 0)
  })

  test('the page never scrolls sideways', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.getElementById('skills')!.scrollIntoView({ behavior: 'instant' }))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
})
