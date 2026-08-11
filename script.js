/* Эта часть автоматически подставляет значения из config.js на страницу. */
document.querySelectorAll("[data-text]").forEach((element) => {
  const value = nitroConfig.text[element.dataset.text];
  if (value) element.textContent = value;
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const url = nitroConfig.links[element.dataset.link];
  if (url) element.href = url;
});

const logo = document.querySelector(".logo");
if (nitroConfig.logo) logo.src = nitroConfig.logo;
document.querySelector("#year").textContent = new Date().getFullYear();

/* Карточки мягко появляются, только когда пользователь до них долистывает. */
const animatedItems = document.querySelectorAll(".link-card, .section-label");
animatedItems.forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 75}ms`);
  element.style.setProperty("--reveal-x", index % 2 ? "42px" : "-42px");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  animatedItems.forEach((element) => revealObserver.observe(element));
} else {
  animatedItems.forEach((element) => element.classList.add("is-visible"));
}
