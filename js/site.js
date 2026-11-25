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

// ---------- Animations complémentaires ----------
if (!reduceMotion) {
  // Barre de progression de lecture
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  // Léger effet de parallaxe sur la photo d'accueil
  const heroImg = document.querySelector(".hero-media img");

  let frame = null;
  const animateOnScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    if (heroImg && window.scrollY < window.innerHeight * 1.2) {
      heroImg.style.setProperty("--parallax", `${Math.round(window.scrollY * 0.25)}px`);
    }
    frame = null;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(animateOnScroll);
    },
    { passive: true }
  );
  animateOnScroll();

  // Chiffres clés qui défilent jusqu'à leur valeur
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const runCounter = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }
}
