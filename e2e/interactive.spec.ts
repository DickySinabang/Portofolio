import { expect, test } from '@playwright/test'

test.describe('command palette', () => {
  test('opens from the navbar, filters, navigates, and returns focus', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Open command palette' })
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'Command palette' })
    await expect(dialog).toBeVisible()
    const search = dialog.getByRole('combobox', { name: 'Search commands' })
    await expect(search).toBeFocused()

    await search.fill('about')
    await expect(dialog.getByRole('option', { name: /^About/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await search.press('Enter')

    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/\/#about$/)
  })

  test('shows an empty state and closes with Escape', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Open command palette' })
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'Command palette' })
    await dialog.getByRole('combobox', { name: 'Search commands' }).fill('zzzzqqqq')
    await expect(dialog.getByText('No matching commands.')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('opens with Ctrl+K on a desktop keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard shortcut is for desktop')

    await page.goto('/')
    await page.keyboard.press('Control+K')

    await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
  })

  test('can switch the theme', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Open command palette' }).click()
    const dialog = page.getByRole('dialog', { name: 'Command palette' })
    await dialog.getByRole('combobox', { name: 'Search commands' }).fill('theme')
    await page.keyboard.press('Enter')

    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible()
  })
})

test.describe('theme', () => {
  test('defaults to dark, switches, and remembers the choice after reload', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light')

    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible()
  })
})

test.describe('terminal', () => {
  test('answers typed commands from the site data', async ({ page }) => {
    await page.goto('/')
    const input = page.getByLabel('Type a command')
    const log = page.getByRole('log', { name: 'Terminal output' })

    await input.fill('help')
    await input.press('Enter')
    await expect(log).toContainText('Available commands:')
    await expect(input).toHaveValue('')

    await input.fill('about')
    await input.press('Enter')
    await expect(log).toContainText('Education:')
  })

  test('reports unknown commands and can be cleared', async ({ page }) => {
    await page.goto('/')
    const input = page.getByLabel('Type a command')
    const log = page.getByRole('log', { name: 'Terminal output' })

    await input.fill('nonsense')
    await input.press('Enter')
    await expect(log).toContainText('command not found: nonsense')

    await input.fill('clear')
    await input.press('Enter')
    await expect(log).not.toContainText('command not found')
  })

  test('recalls the previous command with the up arrow', async ({ page }) => {
    await page.goto('/')
    const input = page.getByLabel('Type a command')

    await input.fill('help')
    await input.press('Enter')
    await input.press('ArrowUp')

    await expect(input).toHaveValue('help')
  })

  test('quick-command buttons work without a keyboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'help', exact: true }).click()

    await expect(page.getByRole('log', { name: 'Terminal output' })).toContainText(
      'Available commands:',
    )
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('shows the interests as static text instead of a typing animation', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.locator('p', { hasText: 'Currently interested in' }),
    ).toContainText('·')
  })
})