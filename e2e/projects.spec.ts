import { expect, test } from '@playwright/test'

test.describe('projects', () => {
  test('a project card opens its detail page and links back', async ({ page }) => {
    await page.goto('/')
    const detailLinks = page.getByRole('link', { name: /^View Details/ })
    test.skip((await detailLinks.count()) === 0, 'No projects in portfolio.ts yet')

    await detailLinks.first().click()
    await expect(page).toHaveURL(/\/projects\/[^/]+$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await page.getByRole('link', { name: 'Back to projects' }).first().click()
    await expect(page).toHaveURL(/\/#projects$/)
  })

  test('category filters narrow the project list', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('group', { name: 'Filter projects by category' })
    test.skip(
      (await group.count()) === 0,
      'Filters only appear when projects span two or more categories',
    )

    const cards = page.getByRole('link', { name: /^View Details/ })
    const totalBefore = await cards.count()
    const buttons = group.getByRole('button')

    await buttons.nth(1).click()
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true')
    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'false')
    expect(await cards.count()).toBeLessThan(totalBefore)

    await buttons.first().click()
    await expect(cards).toHaveCount(totalBefore)
  })
})