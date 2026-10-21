import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Checkout from "./Checkout";
import cartReducer from "../store/cartSlice";
import { request } from "../lib/api";
jest.mock("../lib/api", () => ({ request: jest.fn() }));
const item = { id: "p1", title: "Chair", price: 20, quantity: 2, stock: 4 };
function setup() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: () => ({ user: { id: "user1", email: "buyer@example.com" } }),
    },
    preloadedState: { cart: { items: [item] } },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}
beforeEach(() => {
  request.mockReset();
  sessionStorage.clear();
  Object.defineProperty(window, "crypto", {
    configurable: true,
    value: { randomUUID: () => "checkout-test-00001" },
  });
});
test("checkout sends IDs and quantities only, blocks repeat clicks, and clears cart on success", async () => {
  let finish;
  request.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const store = setup();
  const button = screen.getByRole("button", { name: "Confirm order" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(request).toHaveBeenCalledTimes(1);
  const [path, options] = request.mock.calls[0];
  expect(path).toBe("/orders");
  expect(JSON.parse(options.body)).toEqual({
    products: [{ id: "p1", quantity: 2 }],
  });
  expect(options.headers["Idempotency-Key"]).toBe("checkout-test-00001");
  finish({ id: "order1" });
  await screen.findByText("Your order has been received.");
  expect(store.getState().cart.items).toEqual([]);
});
test("a failed checkout keeps the bag and retries with the same idempotency key", async () => {
  request
    .mockRejectedValueOnce(new Error("Not enough stock"))
    .mockResolvedValueOnce({ id: "order1" });
  const store = setup();
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Not enough stock",
  );
  expect(store.getState().cart.items).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  expect(request.mock.calls[0][1].headers).toEqual(
    request.mock.calls[1][1].headers,
  );
  await screen.findByText("Your order has been received.");
});
