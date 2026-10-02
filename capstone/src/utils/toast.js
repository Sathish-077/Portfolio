let timer;
export function toast(message) {
  const box = document.querySelector("#toast");
  if (!box) return;
  box.textContent = message;
  box.classList.add("is-visible");
  clearTimeout(timer);
  timer = setTimeout(() => box.classList.remove("is-visible"), 2400);
}
