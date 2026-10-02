import { addRoute, setNotFound, onRouteChange, startRouter } from "./router.js";
import { subscribe, cartCount } from "./store.js";
import { homePage } from "./pages/home.js";
import { catalogPage } from "./pages/catalog.js";
import { productPage } from "./pages/product.js";
import { cartPage } from "./pages/cart.js";
import { checkoutPage } from "./pages/checkout.js";
import { confirmationPage } from "./pages/confirmation.js";
import { notFoundPage } from "./pages/not-found.js";

const app = document.querySelector("#app");
const badge = document.querySelector("#cart-count");
const navLinks = document.querySelectorAll("[data-nav]");

addRoute("/", homePage);
addRoute("/products", catalogPage);
addRoute("/product/:id", productPage);
addRoute("/cart", cartPage);
addRoute("/checkout", checkoutPage);
addRoute("/confirmation", confirmationPage);
setNotFound(notFoundPage);

onRouteChange((page, path) => {
  app.replaceChildren(page.node);
  document.title = page.title + " | ShopSphere";
  navLinks.forEach(link => {
    const active = link.dataset.nav === "/" ? path === "/" : path.startsWith(link.dataset.nav);
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
  const heading = app.querySelector("h1");
  if (heading) heading.focus({ preventScroll: true }); // move focus for keyboard and screen-reader users
});

function updateBadge() {
  const count = cartCount();
  badge.textContent = count;
  badge.hidden = count === 0;
}
subscribe(updateBadge);
updateBadge();

// Theme toggle
const themeBtn = document.querySelector("#theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
let saved = null;
try { saved = localStorage.getItem("shopsphere-theme"); } catch (error) { /* ignore */ }
applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("shopsphere-theme", next); } catch (error) { /* ignore */ }
});

document.querySelector("#year").textContent = new Date().getFullYear();
startRouter();
