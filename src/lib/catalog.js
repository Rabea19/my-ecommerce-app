export const money = (value) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
export const categoryKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase() === "laptops"
    ? "computers"
    : String(value || "")
        .trim()
        .toLowerCase();
export const categoryName = (value) =>
  ({
    home: "Home appliances",
    computers: "Computers",
    crochet: "Crochet by Hager",
    mobiles: "Mobiles",
    clothes: "Clothing",
    furniture: "Furniture",
  })[categoryKey(value)] || value;
export function filterProducts(
  products,
  { query = "", category = "all", sort = "featured", available = false } = {},
) {
  const result = products.filter(
    (p) =>
      (category === "all" ||
        categoryKey(p.category) === categoryKey(category)) &&
      `${p.name || p.title} ${p.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()) &&
      (!available || p.stock > 0),
  );
  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (sort === "name")
    result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return result;
}
