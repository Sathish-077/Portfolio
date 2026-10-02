import { h } from "../utils/dom.js";
import { formatPrice } from "../utils/format.js";
import { lastOrder } from "./checkout.js";

export function confirmationPage() {
  if (!lastOrder) {
    return { title: "Order", node: h("div", { class: "container section" }, h("h1", { tabindex: "-1" }, "No recent order"), h("a", { class: "btn btn-primary", href: "#/products" }, "Start shopping")) };
  }
  return {
    title: "Order confirmed",
    node: h("div", { class: "container section confirm" },
      h("p", { class: "confirm-icon", "aria-hidden": "true" }, "✅"),
      h("h1", { tabindex: "-1" }, "Thank you, " + lastOrder.name.split(" ")[0] + "!"),
      h("p", {}, "Your order " + lastOrder.id + " (" + lastOrder.items + (lastOrder.items === 1 ? " item" : " items") + ", " + formatPrice(lastOrder.total) + ") has been placed."),
      h("p", {}, "A confirmation would be sent to " + lastOrder.email + " in a real store."),
      h("a", { class: "btn btn-primary", href: "#/products" }, "Continue shopping"))
  };
}
