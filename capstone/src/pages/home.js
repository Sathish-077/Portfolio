import { h } from "../utils/dom.js";
import { products, CATEGORIES } from "../data/products.js";
import { productCard } from "../components/product-card.js";

export function homePage() {
  const featured = products.filter(p => p.featured).slice(0, 4);
  return {
    title: "Home",
    node: h("div", {},
      h("section", { class: "hero" },
        h("div", { class: "container hero-inner" },
          h("p", { class: "eyebrow" }, "Capstone project · E-commerce catalog"),
          h("h1", { tabindex: "-1" }, "Smart gear for everyday life"),
          h("p", { class: "hero-text" }, "Browse headphones, wearables, accessories and home essentials. Fast, accessible and fully client-side."),
          h("div", { class: "hero-actions" },
            h("a", { class: "btn btn-primary", href: "#/products" }, "Shop all products"),
            h("a", { class: "btn btn-secondary", href: "#/products?sort=rating" }, "Top rated")))),
      h("section", { class: "section container" },
        h("h2", {}, "Shop by category"),
        h("ul", { class: "category-grid" },
          CATEGORIES.map(cat => h("li", {}, h("a", { class: "category-tile", href: "#/products?category=" + cat.id }, h("span", {}, cat.label), h("small", {}, products.filter(p => p.category === cat.id).length + " products")))))),
      h("section", { class: "section container" },
        h("div", { class: "section-head" }, h("h2", {}, "Featured products"), h("a", { href: "#/products" }, "View all →")),
        h("ul", { class: "product-grid" }, featured.map((p, i) => productCard(p, { eager: i < 2 })))),
      h("section", { class: "section container" },
        h("ul", { class: "perk-grid" },
          [["🚚", "Free delivery", "On orders above ₹2,000"], ["↩️", "Easy returns", "7-day no-questions return"], ["🔒", "Secure checkout", "Your data stays in your browser"]]
            .map(([icon, title, text]) => h("li", { class: "perk" }, h("span", { "aria-hidden": "true" }, icon), h("div", {}, h("strong", {}, title), h("p", {}, text)))))))
  };
}
