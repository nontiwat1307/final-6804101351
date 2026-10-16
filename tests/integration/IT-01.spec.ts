import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head><title>Inventory Stub</title></head>
        <body>
          <h1 id="stub-status">Mock Inventory Ready</h1>
          <ul id="stub-inventory">
            <li class="stub-item"><span class="stub-name">Mock Backpack</span></li>
            <li class="stub-item"><span class="stub-name">Mock Bike Light</span></li>
          </ul>
        </body>
      </html>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    await expect(page.locator('#stub-status')).toHaveText('Mock Inventory Ready');
    const items = page.locator('.stub-item');
    await expect(items).toHaveCount(2);
    await expect(page.locator('.stub-name')).toHaveText(['Mock Backpack', 'Mock Bike Light']);
  });
});
