import { h, productImage } from "../utils/dom.js";
import { getProduct } from "../data/products.js";
import { formatPrice } from "../utils/format.js";
import { getCart, setQty, removeFromCart, cartTotals } from "../store.js";
import { navigate } from "../router.js";

export function cartPage() {
  const root = h("div", { class: "container section" });

  function render() {
    const lines = getCart();
    if (lines.length === 0) {
      root.replaceChildren(
        h("h1", { tabindex: "-1" }, "Your cart"),
        h("p", { class: "empty" }, "Your cart is empty."),
        h("a", { class: "btn btn-primary", href: "#/products" }, "Continue shopping"));
      return;
    }
    const totals = cartTotals();
    root.replaceChildren(
      h("h1", { tabindex: "-1" }, "Your cart"),
      h("div", { class: "cart-layout" },
        h("ul", { class: "cart-list" }, lines.map(line => {
          const p = getProduct(line.id);
          return h("li", { class: "cart-line" },
            h("a", { class: "cart-thumb", href: "#/product/" + p.id }, productImage(p, { sizes: "96px" })),
            h("div", { class: "cart-info" },
              h("a", { href: "#/product/" + p.id }, h("strong", {}, p.name)),
              h("p", { class: "price" }, formatPrice(p.price)),
              h("button", { class: "link-btn", type: "button", onclick: () => { removeFromCart(p.id); render(); } }, "Remove")),
            h("div", { class: "qty-control", role: "group", "aria-label": "Quantity for " + p.name },
              h("button", { type: "button", "aria-label": "Decrease quantity", onclick: () => { setQty(p.id, line.qty - 1); render(); } }, "−"),
              h("span", { "aria-live": "polite" }, line.qty),
              h("button", { type: "button", "aria-label": "Increase quantity", onclick: () => { setQty(p.id, line.qty + 1); render(); } }, "+")),
            h("p", { class: "line-total" }, formatPrice(p.price * line.qty)));
        })),
        h("aside", { class: "summary", "aria-label": "Order summary" },
          h("h2", {}, "Order summary"),
          h("dl", {},
            h("div", {}, h("dt", {}, "Subtotal"), h("dd", {}, formatPrice(totals.subtotal))),
            h("div", {}, h("dt", {}, "Shipping"), h("dd", {}, totals.shipping ? formatPrice(totals.shipping) : "Free")),
            h("div", { class: "total" }, h("dt", {}, "Total"), h("dd", {}, formatPrice(totals.total)))),
          h("button", { class: "btn btn-primary btn-block", type: "button", onclick: () => navigate("/checkout") }, "Proceed to checkout"))));
  }

  render();
  return { title: "Cart", node: root };
}
