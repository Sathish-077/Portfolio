import { getProduct } from "./data/products.js";

const KEY = "shopsphere-cart";
const listeners = new Set();

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(data) ? data.filter(line => getProduct(line.id) && line.qty > 0) : [];
  } catch (error) {
    return [];
  }
}

let cart = load();

function commit() {
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (error) { /* storage unavailable */ }
  listeners.forEach(fn => fn(cart));
}

export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
export const getCart = () => cart;
export const cartCount = () => cart.reduce((sum, line) => sum + line.qty, 0);

export function addToCart(id, qty = 1) {
  const line = cart.find(item => item.id === id);
  if (line) line.qty = Math.min(10, line.qty + qty);
  else cart = [...cart, { id, qty: Math.min(10, qty) }];
  commit();
}

export function setQty(id, qty) {
  cart = qty <= 0 ? cart.filter(item => item.id !== id) : cart.map(item => (item.id === id ? { ...item, qty: Math.min(10, qty) } : item));
  commit();
}

export function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  commit();
}

export function clearCart() {
  cart = [];
  commit();
}

export function cartTotals() {
  const subtotal = cart.reduce((sum, line) => sum + getProduct(line.id).price * line.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
  return { subtotal, shipping, total: subtotal + shipping };
}
