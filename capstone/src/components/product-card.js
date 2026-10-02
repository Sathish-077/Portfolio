import { h, productImage } from "../utils/dom.js";
import { formatPrice, stars } from "../utils/format.js";
import { addToCart } from "../store.js";
import { toast } from "../utils/toast.js";

export function productCard(product, { eager = false } = {}) {
  return h("li", { class: "product-card" },
    h("a", { class: "product-card-link", href: "#/product/" + product.id, "aria-label": product.name + ", " + formatPrice(product.price) },
      h("div", { class: "product-card-media" }, productImage(product, { eager })),
      h("div", { class: "product-card-body" },
        h("p", { class: "product-card-cat" }, product.category),
        h("h3", {}, product.name),
        h("p", { class: "rating", "aria-label": "Rated " + product.rating + " out of 5" }, h("span", { "aria-hidden": "true" }, stars(product.rating)), " ", product.rating),
        h("p", { class: "price" }, formatPrice(product.price)))),
    h("button", {
      class: "btn btn-primary btn-block", type: "button",
      onclick: () => { addToCart(product.id); toast(product.name + " added to cart"); }
    }, "Add to cart"));
}
