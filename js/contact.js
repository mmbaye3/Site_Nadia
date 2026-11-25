const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const messageDialog = document.getElementById("message-dialog");
const submitButton = contactForm.querySelector("button[type='submit']");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  formStatus.hidden = false;
  formStatus.textContent = "Envoi en cours…";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error("L’envoi a échoué.");
    }

    contactForm.reset();
    formStatus.hidden = true;
    messageDialog.showModal();
  } catch {
    formStatus.textContent = "Votre message n’a pas pu être envoyé. Vérifiez votre connexion et réessayez.";
  } finally {
    submitButton.disabled = false;
  }
});
  
