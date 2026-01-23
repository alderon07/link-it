import { test, expect } from "@playwright/test";

/**
 * Smoke Tests
 *
 * These tests verify that the application is working at a basic level.
 * They should run quickly and catch major issues.
 */

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Page should load without errors
    await expect(page).toHaveTitle(/Link-It/i);

    // No console errors (excluding expected warnings)
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });

  test("health endpoint returns healthy status", async ({ request }) => {
    const response = await request.get("/api/v1/health");

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body).toHaveProperty("timestamp");
    expect(body).toHaveProperty("version");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");

    // Should see Clerk sign-in component or redirect
    await expect(page).toHaveURL(/login|sign-in/);
  });

  test("non-existent page shows 404", async ({ page }) => {
    const response = await page.goto("/this-page-definitely-does-not-exist-12345");

    // Should return 404 status
    expect(response?.status()).toBe(404);
  });

  test("public profile route is accessible", async ({ page }) => {
    // Try to access a username route
    // This should either show a profile or a "not found" message
    // but should NOT show a server error
    await page.goto("/testuser");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Should not have an application error
    const pageContent = await page.textContent("body");
    expect(pageContent).not.toContain("Application error");
    expect(pageContent).not.toContain("Internal Server Error");
  });
});

test.describe("API Routes", () => {
  test("webhook endpoint exists", async ({ request }) => {
    // POST to webhook should accept the request (even if it fails validation)
    const response = await request.post("/api/webhooks/clerk", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {},
    });

    // Should not be 404 (endpoint exists)
    expect(response.status()).not.toBe(404);
  });
});

test.describe("Security Headers", () => {
  test("response includes security headers", async ({ request }) => {
    const response = await request.get("/");

    const headers = response.headers();

    // Check for security headers we configured
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["content-security-policy"]).toBeDefined();
  });
});
