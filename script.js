/* Подстановка текстов и ссылок из config.js. */
const siteConfig = typeof nitroConfig !== "undefined" ? nitroConfig : null;

document.querySelectorAll("[data-text]").forEach((element) => {
  const value = siteConfig?.text?.[element.dataset.text];
  if (value) element.textContent = value;
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const url = siteConfig?.links?.[element.dataset.link];
  if (url) element.href = url;
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

/* Plays the transparent video where supported; iPhone gets a CSS logo fallback. */
const logoVideo = document.querySelector(".logo-video");
const logoPanel = document.querySelector(".logo-panel");
let videoFallbackTimer;

const showLogoFallback = () => {
  if (logoPanel) logoPanel.classList.add("is-fallback");
};

const showLogoVideo = () => {
  window.clearTimeout(videoFallbackTimer);
  if (logoPanel) logoPanel.classList.remove("is-fallback");
};

if (logoVideo) {
  logoVideo.muted = true;
  const startLogoVideo = () => logoVideo.play().catch(showLogoFallback);

  logoVideo.addEventListener("canplay", () => {
    showLogoVideo();
    startLogoVideo();
  }, { once: true });

  logoVideo.addEventListener("error", showLogoFallback, { once: true });

  videoFallbackTimer = window.setTimeout(() => {
    if (logoVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) showLogoFallback();
  }, 2200);

  startLogoVideo();
}

/* Kontakt enters immediately; later sections still rise into view on scroll. */
const animatedItems = [...document.querySelectorAll(".link-card, .section-label")];
const immediateItems = animatedItems.filter((element) => element.dataset.reveal === "immediate");
let readyToReveal = false;
let immediateIndex = 0;

animatedItems.forEach((element, index) => {
  element.classList.add("reveal-item");
  const delay = element.dataset.reveal === "immediate"
    ? immediateIndex++ * 110
    : Math.min(index % 3, 2) * 150;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

const revealScrolledItems = () => {
  if (!readyToReveal) return;

  const revealLine = window.innerHeight * 0.96;
  animatedItems.forEach((element) => {
    if (element.dataset.reveal === "immediate" || element.classList.contains("is-visible")) return;
    if (element.getBoundingClientRect().top < revealLine) element.classList.add("is-visible");
  });
};

window.addEventListener("scroll", revealScrolledItems, { passive: true });
window.addEventListener("resize", revealScrolledItems);
window.addEventListener("load", revealScrolledItems, { once: true });

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    readyToReveal = true;
    immediateItems.forEach((element) => element.classList.add("is-visible"));
    revealScrolledItems();
  });
});