const cardHoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

document.querySelectorAll(".skill-card-toggle").forEach((button) => {
  const card = button.closest(".skill-card");
  const back = document.getElementById(button.getAttribute("aria-controls"));

  card.addEventListener("pointerenter", () => {
    if (!cardHoverMedia.matches) return;
    button.setAttribute("aria-expanded", "true");
    back.setAttribute("aria-hidden", "false");
  });

  card.addEventListener("pointerleave", () => {
    if (!cardHoverMedia.matches || card.classList.contains("is-flipped")) return;
    button.setAttribute("aria-expanded", "false");
    back.setAttribute("aria-hidden", "true");
  });

  button.addEventListener("click", (event) => {
    if (cardHoverMedia.matches && event.detail > 0) return;
    const isFlipped = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isFlipped));
    back.setAttribute("aria-hidden", String(isFlipped));
    card.classList.toggle("is-flipped", !isFlipped);
  });
});
  
