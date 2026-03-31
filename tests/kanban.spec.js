import { test, expect } from '@playwright/test'

test.describe('Kanban Board', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage so each test starts from the default board state
    await page.evaluate(() => localStorage.removeItem('content-kanban-board-v1'))
    await page.reload()
  })

  test('add a new card to the Ideas column', async ({ page }) => {
    // Click the "+" button on the Ideas column
    await page.getByRole('button', { name: 'Add card to Ideas' }).click()

    // Modal should open
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('New card')).toBeVisible()

    // Fill in title and description
    await modal.getByPlaceholder("What's this content about?").fill('Playwright test card')
    await modal.getByPlaceholder('Notes, references, brief...').fill('Added by automated test')

    // Change format to Carousel
    await modal.getByRole('combobox').selectOption('Carousel')

    // Save
    await modal.getByRole('button', { name: 'Add card' }).click()

    // Modal should close
    await expect(modal).not.toBeVisible()

    // New card should appear in Ideas column with the correct format badge
    const ideasColumn = page.locator('.column').filter({ hasText: 'Ideas' })
    const newCard = ideasColumn.locator('.card').filter({ hasText: 'Playwright test card' })
    await expect(newCard).toBeVisible()
    await expect(newCard.locator('.card-format-badge')).toHaveText('Carousel')

    // Header stat for "total" should have increased by 1 (default is 6 cards)
    await expect(page.locator('.header-stat').filter({ hasText: 'total' })).toContainText('7')
  })

  test('edit a card title and then delete it', async ({ page }) => {
    // Click the existing "Behind-the-scenes morning routine" card in Ideas
    const ideasColumn = page.locator('.column').filter({ hasText: 'Ideas' })
    await ideasColumn.getByText('Behind-the-scenes morning routine').click()

    // Edit modal opens
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('Edit card')).toBeVisible()

    // Update the title
    const titleInput = modal.getByPlaceholder("What's this content about?")
    await titleInput.clear()
    await titleInput.fill('Updated by Playwright')
    await modal.getByRole('button', { name: 'Save' }).click()

    // Modal closes and updated title is visible
    await expect(modal).not.toBeVisible()
    await expect(ideasColumn.getByText('Updated by Playwright')).toBeVisible()

    // Re-open the card to delete it
    await ideasColumn.getByText('Updated by Playwright').click()
    await expect(modal).toBeVisible()

    // First click on Delete shows confirmation
    await modal.getByRole('button', { name: 'Delete' }).click()
    await expect(modal.getByRole('button', { name: 'Are you sure?' })).toBeVisible()

    // Confirm deletion
    await modal.getByRole('button', { name: 'Are you sure?' }).click()

    // Card should be gone from the column
    await expect(modal).not.toBeVisible()
    await expect(ideasColumn.getByText('Updated by Playwright')).not.toBeVisible()
  })

})
