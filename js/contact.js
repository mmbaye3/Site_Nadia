const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const formStatus = document.getElementById("form-status");
  const messageDialog = document.getElementById("message-dialog");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const submitLabel = submitButton.innerHTML;

  // Pré-sélectionne le domaine si l'on arrive depuis une expertise (contact.html?domaine=...)
  const domaine = new URLSearchParams(location.search).get("domaine");
  const select = contactForm.querySelector("select[name='domaine']");
  if (domaine && select && [...select.options].some((o) => o.value === domaine)) select.value = domaine;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours…";
    formStatus.hidden = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Échec de l'envoi");

      contactForm.reset();
      messageDialog.showModal();
    } catch {
      formStatus.textContent =
        "Votre message n’a pas pu être envoyé. Vérifiez votre connexion et réessayez, ou appelez le 01 77 35 14 40.";
      formStatus.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = submitLabel;
    }
  });
}
