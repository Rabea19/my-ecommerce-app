import reducer, {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "./cartSlice";
const product = { id: "p1", name: "Chair", price: 120, stock: 2 };
beforeEach(() => localStorage.clear());
test("cart persists quantities and enforces available stock", () => {
  let state = reducer({ items: [] }, addToCart(product));
  state = reducer(state, addToCart(product));
  state = reducer(state, addToCart(product));
  state = reducer(state, increaseQuantity("p1"));
  expect(state.items[0].quantity).toBe(2);
  expect(JSON.parse(localStorage.getItem("cartItems"))[0].quantity).toBe(2);
  state = reducer(state, decreaseQuantity("p1"));
  expect(state.items[0].quantity).toBe(1);
  state = reducer(state, removeFromCart("p1"));
  expect(state.items).toEqual([]);
});
test("sold out products cannot be added and checkout clears persistence", () => {
  expect(
    reducer({ items: [] }, addToCart({ ...product, stock: 0 })).items,
  ).toEqual([]);
  let state = reducer({ items: [] }, addToCart(product));
  state = reducer(state, clearCart());
  expect(state.items).toEqual([]);
  expect(localStorage.getItem("cartItems")).toBeNull();
});
