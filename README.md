# Software Testing Final Exam — Playwright (TypeScript)

- รหัสนักศึกษา: <6804101351>
- ชื่อ-นามสกุล: <นนทิวัฒน์ ตะตานัง>
- ระบบที่ทดสอบ: https://www.saucedemo.com/
- เครื่องมือ: Playwright Test (TypeScript)

## วิธีรัน

```bash
npm install
npx playwright install chromium
npx playwright test
npm run summary        # สร้าง reports/test-summary.md จากผลจริง
npx playwright show-report
```

## โครงสร้าง

| ข้อ | ไฟล์ | หัวข้อ |
|---|---|---|
| UT-01 | tests/unit/UT-01.spec.ts | Login Form Validation (3 test cases) |
| UT-02 | tests/unit/UT-02.spec.ts | Product Button State |
| IT-01 | tests/integration/IT-01.spec.ts | Top-Down + Stub |
| IT-02 | tests/integration/IT-02.spec.ts | Bottom-Up + Driver |
| ST-01 | tests/system/ST-01.spec.ts | Complete Purchase Flow |
| ST-02 | tests/system/ST-02.spec.ts | Checkout Validation and Recovery |

> หมายเหตุ: บทที่ 1 เป็น UI Component/Functional Testing แบบ Black-box ผ่านเบราว์เซอร์ ไม่ใช่ Unit Test ของฟังก์ชันภายใน

## IT-01: Top-Down Integration Testing ด้วย Stub

**ส่วนที่เป็น Real**
- หน้า Login ของ SauceDemo จริง
- การกรอก standard_user / secret_sauce และการกด Login
- การนำทางไปยัง `inventory.html` จริง (ตรวจสอบด้วย URL)

**ส่วนที่เป็น Stub**
- หน้า Inventory ถูกแทนด้วย HTML จำลองที่สร้างด้วย `page.setContent()` หลัง Login สำเร็จ
- แสดงข้อความ `Mock Inventory Ready` และสินค้าจำลอง 2 รายการ (`Mock Backpack`, `Mock Bike Light`)

Stub นี้เป็นการจำลอง DOM ระดับ Browser หลัง Login จริง ไม่ได้แทน Internal Module ของ SauceDemo
แนวคิด Top-Down: ทดสอบโมดูลระดับบน (Login) ของจริงก่อน แล้วใช้ Stub แทนโมดูลระดับล่างที่ยังไม่พร้อม/ไม่ต้องการใช้ (Inventory)

## IT-02: Bottom-Up Integration Testing ด้วย Driver

**บทบาทของ Driver (`driverOpenInventory()`)**
- สร้างสถานะ Login โดยเพิ่ม Cookie `session-username=standard_user` ผ่าน `BrowserContext.addCookies()` บนโดเมน `www.saucedemo.com`
- เปิด `https://www.saucedemo.com/inventory.html` โดยตรง โดยไม่ผ่าน Login Form
- ทำหน้าที่แทนโมดูลระดับบน (Login) เพื่อเรียกใช้โมดูลระดับล่าง

**ส่วนที่เป็น Real**
- หน้า Inventory จริง (สินค้า 6 รายการ)
- ปุ่ม Add to cart, Cart Badge และหน้า Shopping Cart จริง

## สรุปผลการทดสอบ

ดู `reports/test-summary.md`, `reports/results.json` และ `playwright-report/index.html`
(เปิดด้วย `npx playwright show-report`)
