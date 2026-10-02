import { h } from "../utils/dom.js";
import { getProduct } from "../data/products.js";
import { formatPrice } from "../utils/format.js";
import { getCart, cartTotals, clearCart } from "../store.js";
import { navigate } from "../router.js";

export let lastOrder = null;

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autocomplete: "name", check: v => v.trim().length >= 3 || "Enter your full name." },
  { name: "email", label: "Email", type: "email", autocomplete: "email", check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address." },
  { name: "phone", label: "Phone number", type: "tel", autocomplete: "tel", check: v => /^[6-9]\d{9}$/.test(v.replace(/\s/g, "")) || "Enter a valid 10-digit mobile number." },
  { name: "address", label: "Address", type: "text", autocomplete: "street-address", check: v => v.trim().length >= 8 || "Enter your full address." },
  { name: "city", label: "City", type: "text", autocomplete: "address-level2", check: v => v.trim().length >= 2 || "Enter your city." },
  { name: "pincode", label: "PIN code", type: "text", autocomplete: "postal-code", inputmode: "numeric", check: v => /^\d{6}$/.test(v.trim()) || "Enter a 6-digit PIN code." }
];

export function checkoutPage() {
  if (getCart().length === 0) {
    return { title: "Checkout", node: h("div", { class: "container section" }, h("h1", { tabindex: "-1" }, "Checkout"), h("p", { class: "empty" }, "Your cart is empty."), h("a", { class: "btn btn-primary", href: "#/products" }, "Browse products")) };
  }

  const totals = cartTotals();
  const errors = {};
  const inputs = {};

  const rows = FIELDS.map(field => {
    const error = h("p", { class: "field-error", id: field.name + "-error" });
    errors[field.name] = error;
    const input = h("input", { id: field.name, name: field.name, type: field.type, autocomplete: field.autocomplete, inputmode: field.inputmode, required: true, "aria-describedby": field.name + "-error" });
    input.addEventListener("input", () => validate(field));
    inputs[field.name] = input;
    return h("div", { class: "field" }, h("label", { for: field.name }, field.label), input, error);
  });

  function validate(field) {
    const result = field.check(inputs[field.name].value);
    const message = result === true ? "" : result;
    errors[field.name].textContent = message;
    inputs[field.name].setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  const form = h("form", { class: "checkout-form", novalidate: true }, rows,
    h("button", { class: "btn btn-primary btn-block", type: "submit" }, "Place order · " + formatPrice(totals.total)));

  form.addEventListener("submit", event => {
    event.preventDefault();
    const results = FIELDS.map(validate);
    const firstBad = FIELDS.find((_, i) => !results[i]);
    if (firstBad) { inputs[firstBad.name].focus(); return; }
    lastOrder = {
      id: "SS" + Date.now().toString(36).toUpperCase(),
      name: inputs.name.value.trim(),
      email: inputs.email.value.trim(),
      total: totals.total,
      items: getCart().reduce((sum, line) => sum + line.qty, 0)
    };
    clearCart();
    navigate("/confirmation");
  });

  return {
    title: "Checkout",
    node: h("div", { class: "container section" },
      h("h1", { tabindex: "-1" }, "Checkout"),
      h("div", { class: "cart-layout" },
        form,
        h("aside", { class: "summary", "aria-label": "Order summary" },
          h("h2", {}, "Your order"),
          h("ul", { class: "mini-list" }, getCart().map(line => h("li", {}, h("span", {}, getProduct(line.id).name + " × " + line.qty), h("span", {}, formatPrice(getProduct(line.id).price * line.qty))))),
          h("dl", {},
            h("div", {}, h("dt", {}, "Shipping"), h("dd", {}, totals.shipping ? formatPrice(totals.shipping) : "Free")),
            h("div", { class: "total" }, h("dt", {}, "Total"), h("dd", {}, formatPrice(totals.total)))),
          h("p", { class: "note" }, "Demo store: no payment is taken and no data leaves your browser."))))
  };
}
