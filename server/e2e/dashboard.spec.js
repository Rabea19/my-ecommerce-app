import { test, expect } from "@playwright/test";
const fits = async (page) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
test("admin manages products and navigates every dashboard page", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/admin/login");
  await fits(page);
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Password", { exact: true })
    .fill("TestOnlyPassword123");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Store overview" }),
  ).toBeVisible();
  await expect(
    page.getByText("Completed revenue", { exact: true }),
  ).toBeVisible();
  await fits(page);
  await page.screenshot({
    path: info.outputPath("dashboard.png"),
    fullPage: true,
  });
  if (info.project.name !== "desktop") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Products", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } else
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Products", exact: true })
      .click();
  await page.getByRole("button", { name: "Add Product", exact: true }).click();
  const name = `Dashboard sample ${info.project.name}`;
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Product name").fill(name);
  await dialog.getByLabel("Price (EGP)").fill("149.50");
  await dialog.getByLabel("Stock", { exact: true }).fill("7");
  await fits(page);
  await page.screenshot({
    path: info.outputPath("product-form.png"),
    fullPage: true,
  });
  await dialog.getByRole("button", { name: "Create Product" }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByLabel("Filter products").fill(name);
  await page
    .getByRole("button", { name: `Edit ${name}`, exact: true })
    .filter({ visible: true })
    .click();
  await dialog.getByLabel("Stock", { exact: true }).fill("3");
  await dialog.getByRole("button", { name: "Update Product" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(
    page
      .getByRole("button", { name: `Edit ${name}`, exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await fits(page);
  await page.screenshot({
    path: info.outputPath("products.png"),
    fullPage: true,
  });
  await page.goto("/admin/catalog");
  await page.getByLabel("Filter products").fill(name);
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.getByText("· 3 in stock")).toBeVisible();
  await fits(page);
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: `Delete ${name}`, exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Nothing to show yet" }),
  ).toBeVisible();
  for (const route of ["orders", "users"]) {
    await page.goto(`/admin/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
    await fits(page);
    await page.screenshot({
      path: info.outputPath(`${route}.png`),
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Admin Login" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
