document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".menu-toggle").forEach((button) => {
  const navigation = document.getElementById(button.getAttribute("aria-controls"));
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      button.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });
});
