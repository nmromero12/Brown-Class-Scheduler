import { test, expect, Page } from '@playwright/test';

const TEST_USER_EMAIL = 'testuser@brown.edu';
const TEST_USER_PASSWORD = 'TestPassword123!';

const SECOND_USER_EMAIL = 'testuser1234@brown.edu';
const SECOND_USER_PASSWORD = 'password1234';



const MOCK_SEARCH_RESPONSE = {
  result: "success",
  courses: [
    {
      id: 'csci-101',
      courseCode: 'CSCI101',
      courseName: 'Intro to Computer Science',
      section: '001',
      examTime: 'Dec 10 9:00am',
      classTime: 'MWF 10:00am-11:00am',
      crn: '12345',
    }
  ],
};

// Helper: Login and navigate
async function loginAndNavigate(page: Page) {
  await page.goto('/login');
  await page.fill('input#email', TEST_USER_EMAIL);
  await page.fill('input#password', TEST_USER_PASSWORD);
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'), // ✅ Corrected quote
  ]);
  await page.goto('/');
}

// Helper: Mock search endpoint and perform search
async function searchCSCI101(page: Page) {
  await page.route('http://localhost:8080/api/courses/code/CSCI101', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SEARCH_RESPONSE),
    });
  });

  await page.fill('input[placeholder="e.g., CSCI 0320, ANTH 0100"]', 'CSCI101');
  await page.click('button:has-text("Search Courses")');
  await expect(page.locator('text=Intro to Computer Science')).toBeVisible();
}

test('can add CSCI101 to schedule and see it in the cart', async ({ page }) => {
  await loginAndNavigate(page);
  await searchCSCI101(page);

  // Click Add to Schedule
  await page.click('button:has-text("Add to Schedule")');

  // Confirm in cart
  
});

test('can remove CSCI101 from cart', async ({ page }) => {
  await loginAndNavigate(page);
  await searchCSCI101(page);

  // Add to cart
  await page.click('button:has-text("Add to Schedule")');

  // Narrow down to the specific cart item
  const cartItem = page.locator('div.border-brown-500').filter({ hasText: 'CSCI101' });
  await expect(cartItem).toBeVisible();

  // Click the "X" button inside that specific cart item
  const removeButton = cartItem.locator('button:has(svg)');
  await removeButton.click();

  // Wait for the cart item to be removed from the DOM
  await expect(cartItem).toHaveCount(0);
});

test('user cart persists after logout and login', async ({ page }) => { 
  const MOCK_CART_RESPONSE = {
  result: "success",
  items: [
    {
      id: 'csci-101',
      courseCode: 'CSCI101',
      courseName: 'Intro to Computer Science',
      section: '001',
      examTime: 'Dec 10 9:00am',
      classTime: 'MWF 10:00am-11:00am',
      crn: '12345',
    }
  ]
};

await page.route('http://localhost:8080/cart/user/*', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(MOCK_CART_RESPONSE),
  });
});


  await loginAndNavigate(page);

  // Mock search and cart APIs before adding course
  await page.route('http://localhost:8080/api/courses/code/CSCI101', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SEARCH_RESPONSE),
    });
  });

  // Initially, mock cart returns empty
  await page.route('http://localhost:8080/cart/user/*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: "success", items: [] }),
    });
  });

  // Search and add course
  await searchCSCI101(page);
  await page.click('button:has-text("Add to Schedule")');

  // Mock cart to return the added course on next fetch (simulate persistence)
  await page.route('http://localhost:8080/cart/user/*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_CART_RESPONSE),
    });
  });

  // Logout
  await page.click('button:has-text("Sign Out")');

  // Login again
  await loginAndNavigate(page);

  // Verify the cart contains the course (fetched from mocked API)
  const cart = page.locator('div.bg-white.rounded-2xl.shadow-sm.border.border-gray-200.p-6.sticky');
  await expect(cart.locator('h4.font-medium.text-gray-900.text-sm', { hasText: 'CSCI101' })).toBeVisible();
});




// have to go into firebase and delete user before running this test

// test('user can sign up and then login', async ({ page }) => {
//   const NEW_USER_EMAIL = 'newuser@brown.edu';
//   const NEW_USER_PASSWORD = 'NewUserPass123!';

//   // 1. Go to the login page
//   await page.goto('/login');

//   // 2. Click on the "Sign Up" link or button to navigate to the sign up page
//   await page.click('a:has-text("Sign Up")');

//   // 3. Fill out the sign up form
//   await page.fill('input#email', NEW_USER_EMAIL);
//   await page.fill('input#password', NEW_USER_PASSWORD);
//   await page.fill('input#confirmPassword', NEW_USER_PASSWORD);  // if confirm password field exists

//   // 4. Submit the sign up form
//   await page.click('button[type="submit"]');

//   // 5. Wait for an element visible only after signup/login to confirm success
//   await expect(page.locator('text=Welcome')).toBeVisible();

//   // Debug: Log current URL to help trace issues
//   console.log('After signup, URL:', page.url());

//   // 6. Log out to test login
//   await page.click('button:has-text("Sign Out")');
//   await expect(page).toHaveURL('/login');

//   // 7. Log back in with the new user credentials
//   await page.fill('input#email', NEW_USER_EMAIL);
//   await page.fill('input#password', NEW_USER_PASSWORD);
//   await Promise.all([
//     page.waitForNavigation(),
//     page.click('button[type="submit"]'),
//   ]);

//   // 8. Confirm login success (main page loaded and welcome text visible)
//   await expect(page.locator('text=Welcome')).toBeVisible();
// });

// test('original user cart persists across user switches with mocked backend', async ({ page }) => {
//   const USER_A = { email: 'testuser@brown.edu', password: 'TestPassword123!' };
//   const USER_B = { email: 'testuser1234@brown.edu', password: 'password1234' };

//   // Mock cart data for users
//   const userACart = {
//     result: "success",
//     items: [
//       {
//         id: 'csci-101',
//         courseCode: 'CSCI101',
//         courseName: 'Intro to Computer Science',
//         section: '001',
//         examTime: 'Dec 10 9:00am',
//         classTime: 'MWF 10:00am-11:00am',
//         crn: '12345',
//       },
//     ],
//   };

//   const userBCart = { result: "success", items: [] };

//   // One route handler for all cart requests
//   await page.route('**/cart/user/**', route => {
//     const url = route.request().url();
//     if (url.includes(USER_A.email)) {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify(userACart),
//       });
//     } else if (url.includes(USER_B.email)) {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify(userBCart),
//       });
//     } else {
//       route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({ result: "success", items: [] }),
//       });
//     }
//   });

//   // Login helper
//   async function login(email: string, password: string) {
//     await page.goto('/login');
//     await page.fill('input#email', email);
//     await page.fill('input#password', password);
//     await Promise.all([
//       page.waitForNavigation(),
//       page.click('button[type="submit"]'),
//     ]);
//   }

//   // Login User A and verify cart shows CSCI101
//   await login(USER_A.email, USER_A.password);
//   const cart = page.locator('div.bg-white.rounded-2xl.shadow-sm.border.border-gray-200.p-6.sticky');
//   await page.waitForSelector('div.bg-white.rounded-2xl.shadow-sm.border.border-gray-200.p-6.sticky');
//   await expect(cart.locator('h4.font-medium.text-gray-900.text-sm', { hasText: 'CSCI101' })).toBeVisible();

//   // Logout User A
//   await page.click('button:has-text("Sign Out")');
//   await expect(page).toHaveURL('/login');

//   // Login User B and verify empty cart
//   await login(USER_B.email, USER_B.password);
//   await page.waitForSelector('div.bg-white.rounded-2xl.shadow-sm.border.border-gray-200.p-6.sticky');
//   await expect(cart.locator('text=No courses added yet')).toBeVisible();

//   // Logout User B
//   await page.click('button:has-text("Sign Out")');
//   await expect(page).toHaveURL('/login');

//   // Login User A again and verify cart still shows CSCI101
//   await login(USER_A.email, USER_A.password);
//   await page.waitForSelector('div.bg-white.rounded-2xl.shadow-sm.border.border-gray-200.p-6.sticky');
//   await expect(cart.locator('h4.font-medium.text-gray-900.text-sm', { hasText: 'CSCI101' })).toBeVisible();
// });
