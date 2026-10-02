import { h, productImage } from "../utils/dom.js";
import { getProduct, products, CATEGORIES } from "../data/products.js";
import { formatPrice, stars } from "../utils/format.js";
import { addToCart } from "../store.js";
import { toast } from "../utils/toast.js";
import { productCard } from "../components/product-card.js";
import { navigate } from "../router.js";
import { notFoundPage } from "./not-found.js";

export function productPage({ params }) {
  const product = getProduct(params.id);
  if (!product) return notFoundPage();

  const category = CATEGORIES.find(c => c.id === product.category);
  const qty = h("select", { id: "qty" }, [1, 2, 3, 4, 5].map(n => h("option", { value: n }, n)));
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return {
    title: product.name,
    node: h("div", { class: "container section" },
      h("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" },
        h("a", { href: "#/" }, "Home"), " / ", h("a", { href: "#/products?category=" + product.category }, category.label), " / ", h("span", { "aria-current": "page" }, product.name)),
      h("div", { class: "detail" },
        h("div", { class: "detail-media" }, productImage(product, { sizes: "(max-width: 800px) 100vw, 480px", eager: true })),
        h("div", { class: "detail-info" },
          h("p", { class: "product-card-cat" }, category.label),
          h("h1", { tabindex: "-1" }, product.name),
          h("p", { class: "rating" }, h("span", { "aria-hidden": "true" }, stars(product.rating)), " " + product.rating + " (" + product.reviews + " reviews)"),
          h("p", { class: "price price-lg" }, formatPrice(product.price)),
          h("p", {}, product.description),
          h("ul", { class: "feature-list" }, product.features.map(f => h("li", {}, f))),
          h("div", { class: "buy-row" },
            h("div", { class: "field" }, h("label", { for: "qty" }, "Quantity"), qty),
            h("button", { class: "btn btn-primary", type: "button", onclick: () => { addToCart(product.id, Number(qty.value)); toast("Added to cart"); } }, "Add to cart"),
            h("button", { class: "btn btn-secondary", type: "button", onclick: () => { addToCart(product.id, Number(qty.value)); navigate("/cart"); } }, "Buy now")))),
      related.length ? h("section", { class: "section" }, h("h2", {}, "You may also like"), h("ul", { class: "product-grid" }, related.map(p => productCard(p)))) : null)
  };
}
