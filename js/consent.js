// ==========================================================================
// Consentement aux cookies
// Seul service tiers déposant des cookies : la carte Google Maps (page Contact).
// Elle n'est chargée qu'après acceptation. Le choix est conservé 6 mois.
// ==========================================================================
(() => {
  const STORAGE_KEY = "nb-cookie-consent";
  const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // 6 mois

  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && (saved.choice === "accepted" || saved.choice === "refused") && Date.now() - saved.date < MAX_AGE) {
        return saved.choice;
      }
    } catch {
      /* stockage indisponible : on redemandera */
    }
    return null;
  };

  const saveConsent = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, date: Date.now() }));
    } catch {
      /* stockage indisponible : le choix vaut pour cette page seulement */
    }
  };

  // ---------- Carte Google Maps ----------
  const loadMaps = () => {
    document.querySelectorAll(".map[data-map-src]").forEach((container) => {
      if (container.querySelector("iframe")) return;
      const iframe = document.createElement("iframe");
      iframe.src = container.dataset.mapSrc;
      iframe.title = container.dataset.mapTitle || "Carte";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
      const placeholder = container.querySelector(".map-placeholder");
      if (placeholder) placeholder.hidden = true;
      container.appendChild(iframe);
    });
  };

  const unloadMaps = () => {
    document.querySelectorAll(".map[data-map-src]").forEach((container) => {
      const iframe = container.querySelector("iframe");
      if (iframe) iframe.remove();
      const placeholder = container.querySelector(".map-placeholder");
      if (placeholder) placeholder.hidden = false;
    });
  };

  const apply = (choice) => (choice === "accepted" ? loadMaps() : unloadMaps());

  // ---------- Bandeau ----------
  let banner = null;
  let lastFocus = null;

  const closeBanner = () => {
    if (!banner) return;
    banner.classList.remove("is-visible");
    banner.addEventListener("transitionend", () => banner && (banner.hidden = true), { once: true });
    setTimeout(() => banner && (banner.hidden = true), 500);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  };

  const choose = (choice) => {
    saveConsent(choice);
    apply(choice);
    closeBanner();
  };

  const buildBanner = () => {
    banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "cookie-title");
    banner.setAttribute("aria-describedby", "cookie-text");
    banner.hidden = true;
    banner.innerHTML = `
      <h2 id="cookie-title">Votre vie privée</h2>
      <p id="cookie-text">Ce site n’utilise des cookies que pour afficher la carte Google Maps de la page Contact. Vous pouvez les accepter ou les refuser&nbsp;: votre choix est modifiable à tout moment.
        <a href="politique-de-confidentialite.html">En savoir plus</a></p>
      <div class="cookie-actions">
        <button class="btn btn--ghost btn--sm" type="button" data-consent="refused">Refuser</button>
        <button class="btn btn--primary btn--sm" type="button" data-consent="accepted">Accepter</button>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (button) choose(button.dataset.consent);
    });
    document.body.appendChild(banner);
  };

  const openBanner = (focus) => {
    if (!banner) buildBanner();
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add("is-visible")));
    if (focus) {
      lastFocus = document.activeElement;
      banner.querySelector("[data-consent='accepted']").focus({ preventScroll: true });
    }
  };

  // ---------- Initialisation ----------
  const consent = readConsent();
  if (consent) apply(consent);
  else openBanner(false);

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-cookie-settings]")) {
      event.preventDefault();
      openBanner(true);
    } else if (event.target.closest("[data-map-accept]")) {
      choose("accepted");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && banner && !banner.hidden && readConsent()) closeBanner();
  });
})();
