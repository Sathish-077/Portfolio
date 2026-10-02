import { h } from "../utils/dom.js";

export function notFoundPage() {
  return {
    title: "Page not found",
    node: h("div", { class: "container section confirm" },
      h("h1", { tabindex: "-1" }, "404 · Page not found"),
      h("p", {}, "The page you are looking for does not exist."),
      h("a", { class: "btn btn-primary", href: "#/" }, "Back to home"))
  };
}
