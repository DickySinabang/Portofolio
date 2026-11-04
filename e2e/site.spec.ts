import { expect, test, type Page } from '@playwright/test'

/** Collects JavaScript errors, console errors, and failed requests (broken images, etc.). */
function watchForProblems(page: Page) {
  const problems: string[] = []
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`)
  })
  return problems
}

test.describe('home page', () => {
  test('loads without errors, broken requests, or missing metadata', async ({ page }) => {
    const problems = watchForProblems(page)

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/)
    await expect(page).toHaveTitle(/.+/)

    expect(problems).toEqual([])
  })

  test('offers a skip link as the first keyboard stop', async ({ page }) => {
    await page.goto('/')
    // Wait for the app to render first; Tab pressed before that has nothing to focus.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.keyboard.press('Tab')

    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  })

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'Widths are set explicitly in the desktop project')

      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      expect(overflows).toBe(false)
    })
  }
})

test.describe('missing pages', () => {
  test('shows a 404 page with a way home', async ({ page }) => {
    await page.goto('/no-such-page')

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')

    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('shows a friendly message for an unknown project', async ({ page }) => {
    await page.goto('/projects/no-such-project')

    await expect(page.getByRole('heading', { level: 1, name: 'Project not found' })).toBeVisible()
    await expect(page).toHaveTitle(/Project not found/)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  })
})

test.describe('navigation', () => {
  test('desktop navbar scrolls to a section and marks it current', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation only')

    await page.goto('/')
    const primary = page.getByRole('navigation', { name: 'Primary' })
    await primary.getByRole('link', { name: 'About' }).click()

    await expect(page).toHaveURL(/\/#about$/)
    await expect(page.getByRole('heading', { name: /Turning ideas/ })).toBeInViewport()
    await expect(primary.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  test('mobile menu opens, navigates, and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile menu only')

    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()

    const mobileNav = page.getByRole('navigation', { name: 'Mobile' })
    await expect(mobileNav).toBeVisible()
    await mobileNav.getByRole('link', { name: 'About' }).click()

    await expect(page).toHaveURL(/\/#about$/)
    await expect(mobileNav).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  })

  test('mobile menu closes with Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile menu only')

    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.keyboard.press('Escape')

    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden()
  })
})