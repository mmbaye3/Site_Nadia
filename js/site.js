// ---------- Année du pied de page ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Menu mobile ----------
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-navigation");

const setMenu = (open) => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  nav.classList.toggle("is-open", open);
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && setMenu(false));
}

// ---------- En-tête et barre d'appel mobile au défilement ----------
const header = document.querySelector(".site-header");
const mobileCta = document.querySelector(".mobile-cta");
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  if (header) header.classList.toggle("is-scrolled", y > 10);
  if (mobileCta) mobileCta.classList.toggle("is-visible", y > 420);
  ticking = false;
};
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);
onScroll();

// ---------- Apparition douce des blocs au défilement ----------
const revealEls = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
  // Les blocs déjà visibles à l'ouverture ne sont pas masqués (pas de clignotement)
  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-visible");
  });
  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealEls.forEach((el) => {
    if (!el.classList.contains("is-visible")) observer.observe(el);
  });
}
