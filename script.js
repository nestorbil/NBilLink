/* Подстановка текстов и ссылок из config.js. */
document.querySelectorAll("[data-text]").forEach((element) => {
  const value = nitroConfig.text[element.dataset.text];
  if (value) element.textContent = value;
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const url = nitroConfig.links[element.dataset.link];
  if (url) element.href = url;
});

const logo = document.querySelector(".logo");
if (logo && nitroConfig.logo) logo.src = nitroConfig.logo;
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* Статичный знак виден до запуска ролика и остаётся при ошибке видео. */
const logoPanel = document.querySelector(".logo-panel.has-video");
const logoVideo = document.querySelector(".logo-video");
if (logoPanel && logoVideo) {
  logoVideo.addEventListener("playing", () => logoPanel.classList.add("is-video-playing"), { once: true });
  logoVideo.addEventListener("error", () => logoPanel.classList.add("video-unavailable"), { once: true });
  logoVideo.play().catch(() => logoPanel.classList.add("video-unavailable"));
}

/* Карточки появляются один раз, когда пользователь до них долистывает. */
const animatedItems = [...document.querySelectorAll(".link-card, .section-label")];
let readyToReveal = false;

animatedItems.forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 150}ms`);
  element.style.setProperty("--reveal-x", index % 2 ? "48px" : "-48px");
});

const revealScrolledItems = () => {
  if (!readyToReveal) return;
  const revealLine = window.innerHeight * 0.86;
  animatedItems.forEach((element) => {
    if (element.classList.contains("is-visible")) return;
    if (element.getBoundingClientRect().top < revealLine) {
      element.classList.add("is-visible");
    }
  });
};

window.addEventListener("scroll", revealScrolledItems, { passive: true });
window.addEventListener("resize", revealScrolledItems);
window.addEventListener("load", revealScrolledItems, { once: true });

/* Два кадра нужны, чтобы браузер успел отрисовать скрытые карточки
   до запуска их анимации. */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    readyToReveal = true;
    revealScrolledItems();
  });
});
