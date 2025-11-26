import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Blog Lounge/);
});

test('can navigate to explore', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Just looking around' }).click();
    await expect(page).toHaveURL(/.*explore/);
    await expect(page.getByText('Community Board')).toBeVisible();
});

test('login redirect', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login if not authenticated
    await page.waitForURL(/.*login/);
});
