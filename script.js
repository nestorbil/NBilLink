/* Подстановка текстов и ссылок из config.js. */
document.querySelectorAll("[data-text]").forEach((element) => {
  const value = window.nitroConfig?.text?.[element.dataset.text];
  if (value) element.textContent = value;
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const url = window.nitroConfig?.links?.[element.dataset.link];
  if (url) element.href = url;
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* WebM stays animated where VP9 alpha is reliable; CSS uses the PNG on WebKit. */
const logoVideo = document.querySelector(".logo-video");
if (logoVideo && getComputedStyle(logoVideo).display !== "none") {
  logoVideo.muted = true;
  const startLogoVideo = () => logoVideo.play().catch(() => {});
  logoVideo.addEventListener("canplay", startLogoVideo, { once: true });
  startLogoVideo();
}

/* Kontakt is visible immediately. Other sections reveal progressively. */
const animatedItems = [...document.querySelectorAll(".link-card:not(.contact-item), .section-label:not(.contact-item)")];

animatedItems.forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 150}ms`);
});

const revealItems = () => {
  const revealLine = window.innerHeight * 0.96;
  animatedItems.forEach((element) => {
    if (element.classList.contains("is-visible")) return;
    if (element.getBoundingClientRect().top < revealLine) element.classList.add("is-visible");
  });
};

window.addEventListener("scroll", revealItems, { passive: true });
window.addEventListener("resize", revealItems);
requestAnimationFrame(() => requestAnimationFrame(revealItems));

/* Last-resort guard for older WebKit or interrupted initialization. */
window.setTimeout(() => {
  animatedItems.forEach((element) => {
    if (!element.classList.contains("is-visible")) element.classList.add("reveal-fallback");
  });
}, 2500);
