import { filterProducts, categoryKey, money } from "./catalog";
const products = [
  { id: 1, name: "Laptop", category: "Laptops", price: 300, stock: 1 },
  { id: 2, name: "Phone", category: "Mobiles", price: 100, stock: 0 },
  { id: 3, name: "Desk", category: "Furniture", price: 200, stock: 4 },
];
test("search, category aliases and stock filter work together", () => {
  expect(categoryKey("Laptops")).toBe("computers");
  expect(
    filterProducts(products, {
      category: "computers",
      query: "lap",
      available: true,
    }),
  ).toEqual([products[0]]);
  expect(filterProducts(products, { query: "phone", available: true })).toEqual(
    [],
  );
});
test("sort does not mutate source and currency is consistent", () => {
  expect(
    filterProducts(products, { sort: "price-low" }).map((p) => p.id),
  ).toEqual([2, 3, 1]);
  expect(products[0].id).toBe(1);
  expect(money(100)).toContain("EGP");
});
