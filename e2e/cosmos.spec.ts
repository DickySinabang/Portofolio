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
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
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

test.describe('skills', () => {
  test('shows the technologies in a grid and never scrolls sideways', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.getElementById('skills')!.scrollIntoView({ behavior: 'instant' }))

    await expect(page.getByRole('list', { name: 'Technologies' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
})