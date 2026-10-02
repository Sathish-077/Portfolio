// Tiny DOM helper: builds elements without innerHTML, so user data can never inject markup.
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key === "class") el.className = value;
    else if (key === "dataset") Object.assign(el.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function productImage(product, { sizes = "(max-width: 600px) 50vw, 25vw", eager = false } = {}) {
  return h("img", {
    src: `assets/images/${product.image}-480.webp`,
    srcset: `assets/images/${product.image}-240.webp 240w, assets/images/${product.image}-480.webp 480w`,
    sizes,
    width: 480,
    height: 480,
    alt: product.name,
    loading: eager ? "eager" : "lazy",
    decoding: "async"
  });
}
