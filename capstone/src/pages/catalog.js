import { h } from "../utils/dom.js";
import { products, CATEGORIES } from "../data/products.js";
import { productCard } from "../components/product-card.js";
import { replaceQuery } from "../router.js";

const SORTS = {
  featured: ["Featured", () => 0],
  "price-asc": ["Price: low to high", (a, b) => a.price - b.price],
  "price-desc": ["Price: high to low", (a, b) => b.price - a.price],
  rating: ["Top rated", (a, b) => b.rating - a.rating],
  name: ["Name: A to Z", (a, b) => a.name.localeCompare(b.name)]
};

export function catalogPage({ query }) {
  const state = {
    q: query.q || "",
    category: CATEGORIES.some(c => c.id === query.category) ? query.category : "",
    sort: SORTS[query.sort] ? query.sort : "featured"
  };

  const grid = h("ul", { class: "product-grid" });
  const empty = h("p", { class: "empty", hidden: true }, "No products match your search.");
  const count = h("p", { class: "result-count", role: "status", "aria-live": "polite" });
  const chips = h("div", { class: "chips", role: "group", "aria-label": "Filter by category" });

  function update() {
    const term = state.q.trim().toLowerCase();
    const list = products
      .filter(p => (!state.category || p.category === state.category) && (!term || (p.name + " " + p.description).toLowerCase().includes(term)))
      .sort(SORTS[state.sort][1]);
    grid.replaceChildren(...list.map((p, i) => productCard(p, { eager: i < 4 })));
    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length === 1 ? " product" : " products");
    chips.replaceChildren(...[{ id: "", label: "All" }, ...CATEGORIES].map(cat =>
      h("button", {
        type: "button", class: "chip" + (state.category === cat.id ? " is-active" : ""), "aria-pressed": String(state.category === cat.id),
        onclick: () => { state.category = cat.id; update(); }
      }, cat.label)));
    replaceQuery("/products", { q: state.q.trim(), category: state.category, sort: state.sort === "featured" ? "" : state.sort });
  }

  const search = h("input", { id: "search", type: "search", placeholder: "Search products…", value: state.q, autocomplete: "off", oninput: e => { state.q = e.target.value; update(); } });
  const sort = h("select", { id: "sort", onchange: e => { state.sort = e.target.value; update(); } },
    Object.entries(SORTS).map(([value, [label]]) => h("option", { value, selected: value === state.sort }, label)));

  const node = h("div", { class: "container section" },
    h("h1", { tabindex: "-1" }, "All products"),
    h("div", { class: "toolbar" },
      h("div", { class: "field" }, h("label", { for: "search" }, "Search"), search),
      h("div", { class: "field" }, h("label", { for: "sort" }, "Sort by"), sort)),
    chips, count, grid, empty);
  update();
  return { title: "Products", node };
}
