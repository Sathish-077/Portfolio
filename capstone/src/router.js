// Minimal hash-based client-side router. Hash URLs work on any static host with no server rewrites.
const routes = [];
let notFound = null;
let onChange = () => {};

export function addRoute(pattern, handler) {
  const keys = [];
  const regex = new RegExp("^" + pattern.replace(/:([a-z]+)/gi, (_, key) => { keys.push(key); return "([^/]+)"; }) + "$");
  routes.push({ regex, keys, handler });
}

export const setNotFound = handler => { notFound = handler; };
export const onRouteChange = fn => { onChange = fn; };

export function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, queryString = ""] = raw.split("?");
  return { path: path.replace(/\/+$/, "") || "/", query: Object.fromEntries(new URLSearchParams(queryString)) };
}

export function navigate(path) {
  if (location.hash === "#" + path) resolve();
  else location.hash = path;
}

export function replaceQuery(path, query) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value) params.set(key, value); });
  const qs = params.toString();
  history.replaceState(null, "", "#" + path + (qs ? "?" + qs : ""));
}

export function resolve() {
  const { path, query } = parseHash();
  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      const params = Object.fromEntries(route.keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]));
      return onChange(route.handler({ params, query }), path);
    }
  }
  return onChange(notFound({ params: {}, query }), path);
}

export const startRouter = () => {
  window.addEventListener("hashchange", resolve);
  resolve();
};
