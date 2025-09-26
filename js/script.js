document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // Al inicio, ocultar mensaje
  formMessage.classList.add("hidden");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Validar campos vacíos
    if (!name || !email || !message) {
      formMessage.style.color = "red";
      formMessage.textContent = "Por favor completa todos los campos.";
      formMessage.classList.remove("hidden");
      formMessage.classList.add("visible");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formMessage.style.color = "red";
      formMessage.textContent = "Por favor ingresa un correo válido.";
      formMessage.classList.remove("hidden");
      formMessage.classList.add("visible");
      return;
    }

    // Enviar con fetch
    fetch(form.action || "https://formspree.io/f/xqayawzz", {
      method: form.method || "POST",
      headers: {
        "Accept": "application/json",
      },
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          formMessage.style.color = "green";
          formMessage.textContent = "¡Mensaje enviado con éxito!";
          form.reset();
        } else {
          return response.json().then((data) => {
            throw new Error(
              data.error || "Hubo un problema al enviar el mensaje."
            );
          });
        }
      })
      .catch((error) => {
        formMessage.style.color = "red";
        formMessage.textContent = "Error al enviar: " + error.message;
      })
      .finally(() => {
        formMessage.classList.remove("hidden");
        formMessage.classList.add("visible");
      });
  });
});
