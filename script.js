const root = document.documentElement;
const themeButtons = document.querySelectorAll(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  root.dataset.theme = "dark";
}

function updateThemeButtons() {
  const dark = root.dataset.theme === "dark";
  themeButtons.forEach(button => {
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
  });
}

themeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const dark = root.dataset.theme === "dark";
    if (dark) {
      delete root.dataset.theme;
      localStorage.setItem("portfolio-theme", "light");
    } else {
      root.dataset.theme = "dark";
      localStorage.setItem("portfolio-theme", "dark");
    }
    updateThemeButtons();
  });
});

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

const yearElements = document.querySelectorAll(".year");
yearElements.forEach(element => {
  element.textContent = new Date().getFullYear();
});

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

if (form && status) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Please complete all required fields correctly.";
      return;
    }

    status.textContent = "Thanks! Your message is ready to be connected to a form backend.";
    form.reset();
  });
}

updateThemeButtons();
