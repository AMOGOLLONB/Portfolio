// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar todas las funcionalidades cuando el DOM esté listo
  initWelcomeModal();
  initNavigation();
  initScrollEffects();
  initSkillBars();
  initContactForm();
  initSmoothScrolling();
});

// ===== NAVEGACIÓN MÓVIL =====
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle del menú hamburguesa
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener("click", function (event) {
    if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
  // Cambiar estilo de la navbar al hacer scroll
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    }
  });

  // Animación de elementos al hacer scroll (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observar elementos para animación
  const animatedElements = document.querySelectorAll(
    ".experience-card, .project-card, .skill-item"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ===== BARRAS DE HABILIDADES =====
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  // Función para animar las barras de habilidades
  function animateSkillBars() {
    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width;
    });
  }

  // Observador para activar la animación cuando las habilidades sean visibles
  const skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(animateSkillBars, 500); // Delay para mejor efecto visual
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const skillsSection = document.querySelector(".skills-section");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevenir envío por defecto

      // Obtener datos del formulario
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Validar campos
      if (validateForm(name, email, message)) {
        // Simular envío del formulario
        showLoadingState();

        setTimeout(() => {
          // Mostrar mensaje de éxito
          showSuccessMessage();

          // Limpiar formulario
          contactForm.reset();

          // Mostrar en consola como se solicitó
          console.log("Formulario enviado correctamente");
          console.log("Datos del formulario:", {
            nombre: name,
            email: email,
            mensaje: message,
          });
        }, 2000);
      }
    });
  }
}

// ===== VALIDACIÓN DEL FORMULARIO =====
function validateForm(name, email, message) {
  let isValid = true;
  const errors = [];

  // Validar nombre
  if (!name || name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
    isValid = false;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Por favor ingresa un email válido");
    isValid = false;
  }

  // Validar mensaje
  if (!message || message.trim().length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres");
    isValid = false;
  }

  // Mostrar errores si los hay
  if (!isValid) {
    showErrorMessage(errors);
  }

  return isValid;
}

// ===== ESTADOS DEL FORMULARIO =====
function showLoadingState() {
  const submitBtn = document.querySelector(
    '#contactForm button[type="submit"]'
  );
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";

  // Restaurar después de 2 segundos
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
  }, 2000);
}

function showSuccessMessage() {
  // Crear mensaje de éxito
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.innerHTML = `
        <div style="
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            animation: slideIn 0.3s ease;
        ">
            ✅ ¡Mensaje enviado correctamente! Te contactaré pronto.
        </div>
    `;

  // Insertar mensaje después del formulario
  const contactForm = document.getElementById("contactForm");
  contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

  // Remover mensaje después de 5 segundos
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

function showErrorMessage(errors) {
  // Crear mensaje de error
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.innerHTML = `
        <div style="
            background: #f44336;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            animation: slideIn 0.3s ease;
        ">
            <strong>❌ Por favor corrige los siguientes errores:</strong>
            <ul style="margin: 0.5rem 0 0 1rem;">
                ${errors.map((error) => `<li>${error}</li>`).join("")}
            </ul>
        </div>
    `;

  // Remover mensajes de error anteriores
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Insertar mensaje de error
  const contactForm = document.getElementById("contactForm");
  contactForm.parentNode.insertBefore(errorMessage, contactForm);

  // Remover mensaje después de 5 segundos
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}

// ===== NAVEGACIÓN SUAVE =====
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Ajustar por navbar fija

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===== EFECTOS ADICIONALES =====

// Efecto parallax suave en la imagen de perfil
window.addEventListener("scroll", function () {
  const profileImg = document.querySelector(".profile-img");
  if (profileImg) {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.1;
    profileImg.style.transform = `translateY(${parallax}px)`;
  }
});

// Efecto hover mejorado en las tarjetas de proyecto
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Animación de escritura para el título principal
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Aplicar efecto de escritura al título principal cuando la página cargue
window.addEventListener("load", function () {
  const mainTitle = document.querySelector(".hero-text h1");
  if (mainTitle) {
    const originalText = mainTitle.textContent;
    typeWriter(mainTitle, originalText, 50);
  }
});

// ===== UTILIDADES =====

// Función para mostrar/ocultar elementos con animación
function toggleElement(element, show = true) {
  if (show) {
    element.style.display = "block";
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 10);
  } else {
    element.style.opacity = "0";
    element.style.transform = "translateY(-20px)";

    setTimeout(() => {
      element.style.display = "none";
    }, 300);
  }
}

// Función para agregar clase activa a enlaces de navegación
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Inicializar actualización de enlaces activos
updateActiveNavLink();

// ===== CONSOLA DE DESARROLLADOR =====
console.log(`
🚀 Portafolio de Jaime Andrés Mogollón Bastidas
📧 Contacto: Disponible a través del formulario
💼 LinkedIn: linkedin.com/in/jaimemogollon
🐙 GitHub: github.com/jaimemogollon
🐦 Twitter: twitter.com/jaime_codes

Desarrollado con HTML5, CSS3 y JavaScript puro.
Diseño responsive y moderno.
`);

// ===== MANEJO DE ERRORES =====
window.addEventListener("error", function (event) {
  console.error("Error en la aplicación:", event.error);
});

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
// Lazy loading para imágenes (si se implementa en el futuro)
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Inicializar lazy loading si hay imágenes con data-src
lazyLoadImages();

// ===== MODAL DE BIENVENIDA =====
function initWelcomeModal() {
  const modal = document.getElementById("welcomeModal");
  const nameForm = document.getElementById("nameForm");
  const userNameInput = document.getElementById("userName");
  const nameFeedback = document.getElementById("nameFeedback");
  const submitBtn = document.getElementById("submitBtn");

  // Elementos de la cámara
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const photoPreview = document.getElementById("photoPreview");
  const photoSection = document.getElementById("photoSection");
  const startCameraBtn = document.getElementById("startCamera");
  const capturePhotoBtn = document.getElementById("capturePhoto");
  const retakePhotoBtn = document.getElementById("retakePhoto");

  let stream = null;
  let capturedPhoto = null;
  let nameValidated = false;

  // Siempre mostrar el modal de bienvenida al cargar la página
  // No verificar localStorage - siempre pedir nombre y foto

  // ===== FUNCIONALIDAD DE CÁMARA =====

  // Activar cámara
  startCameraBtn.addEventListener("click", async function () {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 300,
          height: 300,
          facingMode: "user", // Cámara frontal
        },
      });

      video.srcObject = stream;
      video.style.display = "block";
      photoPreview.style.display = "none";

      startCameraBtn.style.display = "none";
      capturePhotoBtn.style.display = "inline-block";

      // Mostrar mensaje de éxito
      showCameraFeedback("✅ Cámara activada correctamente", "success");
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      showCameraFeedback(
        "❌ No se pudo acceder a la cámara. Verifica los permisos.",
        "error"
      );
    }
  });

  // Capturar foto
  capturePhotoBtn.addEventListener("click", function () {
    if (stream) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      // Convertir a base64
      capturedPhoto = canvas.toDataURL("image/jpeg", 0.8);

      // Mostrar la foto capturada
      photoPreview.innerHTML = `<img src="${capturedPhoto}" alt="Foto capturada">`;
      photoPreview.style.display = "flex";
      video.style.display = "none";

      // Cambiar botones
      capturePhotoBtn.style.display = "none";
      retakePhotoBtn.style.display = "inline-block";

      // Detener la cámara
      stream.getTracks().forEach((track) => track.stop());

      showCameraFeedback("📸 ¡Foto capturada exitosamente!", "success");
      checkFormCompletion();
    }
  });

  // Tomar otra foto
  retakePhotoBtn.addEventListener("click", function () {
    capturedPhoto = null;
    photoPreview.innerHTML = `
      <div class="photo-placeholder">
        <span>👤</span>
        <p>Tu foto aparecerá aquí</p>
      </div>
    `;
    photoPreview.style.display = "flex";
    video.style.display = "none";

    retakePhotoBtn.style.display = "none";
    startCameraBtn.style.display = "inline-block";

    showCameraFeedback("", "");
    checkFormCompletion();
  });

  // Función para mostrar feedback de la cámara
  function showCameraFeedback(message, type) {
    const feedback = document.createElement("div");
    feedback.className = `camera-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 10px;
      padding: 8px 15px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-align: center;
      transition: all 0.3s ease;
    `;

    if (type === "success") {
      feedback.style.background =
        "linear-gradient(135deg, #51cf66 0%, #40c057 100%)";
      feedback.style.color = "white";
    } else if (type === "error") {
      feedback.style.background =
        "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
      feedback.style.color = "white";
    }

    // Remover feedback anterior
    const existingFeedback = document.querySelector(".camera-feedback");
    if (existingFeedback) {
      existingFeedback.remove();
    }

    if (message) {
      document.querySelector(".camera-controls").appendChild(feedback);

      // Remover después de 3 segundos
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
      }, 3000);
    }
  }

  // Validación en tiempo real mientras el usuario escribe
  userNameInput.addEventListener("input", function () {
    const name = this.value.trim();
    validateNameInput(name);
  });

  // Manejar envío del formulario
  nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = userNameInput.value.trim();

    if (validateName(name)) {
      // Guardar nombre y foto en localStorage
      localStorage.setItem("userName", name);
      if (capturedPhoto) {
        localStorage.setItem("userPhoto", capturedPhoto);
      }

      // Mostrar mensaje de éxito
      showSuccessFeedback();

      // Cerrar modal después de un breve delay
      setTimeout(() => {
        modal.style.display = "none";
        showWelcomeMessage(name, capturedPhoto);
      }, 1500);
    }
  });

  // Función para verificar si el formulario está completo
  function checkFormCompletion() {
    const name = userNameInput.value.trim();
    const isNameValid = validateName(name);
    const hasPhoto = capturedPhoto !== null;

    // Solo verificar la foto si el nombre ya está validado
    if (!nameValidated) {
      submitBtn.disabled = true;
      return;
    }

    // Habilitar botón solo si hay foto
    submitBtn.disabled = !hasPhoto;

    if (hasPhoto) {
      showSuccessFeedback("✅ ¡Todo listo! Puedes comenzar");
    } else {
      showErrorFeedback("📸 Por favor toma una foto para continuar");
    }
  }

  // Función para validar el nombre en tiempo real
  function validateNameInput(name) {
    if (name.length === 0) {
      clearFeedback();
      hidePhotoSection();
      return;
    }

    if (name.length < 3) {
      showErrorFeedback("❌ Nombre inválido - Debe tener al menos 3 letras");
      hidePhotoSection();
      return;
    }

    if (/\d/.test(name)) {
      showErrorFeedback("😄 Deje la broma, ponga su nombre para comenzar");
      hidePhotoSection();
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      showErrorFeedback("❌ Solo se permiten letras y espacios");
      hidePhotoSection();
      return;
    }

    showSuccessFeedback("✅ ¡Nombre válido! Ahora toma una foto");
    nameValidated = true;
    showPhotoSection();
  }

  // Función para mostrar la sección de foto
  function showPhotoSection() {
    photoSection.style.display = "block";
    photoSection.style.animation = "slideInUp 0.6s ease";
  }

  // Función para ocultar la sección de foto
  function hidePhotoSection() {
    photoSection.style.display = "none";
    nameValidated = false;
    capturedPhoto = null;
    // Resetear controles de cámara
    startCameraBtn.style.display = "inline-block";
    capturePhotoBtn.style.display = "none";
    retakePhotoBtn.style.display = "none";
    photoPreview.innerHTML = `
      <div class="photo-placeholder">
        <span>👤</span>
        <p>Tu foto aparecerá aquí</p>
      </div>
    `;
  }

  // Función para validar el nombre al enviar
  function validateName(name) {
    if (name.length < 3) {
      showErrorFeedback("❌ Nombre inválido - Debe tener al menos 3 letras");
      userNameInput.focus();
      return false;
    }

    if (/\d/.test(name)) {
      showErrorFeedback("😄 Deje la broma, ponga su nombre para comenzar");
      userNameInput.focus();
      return false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      showErrorFeedback("❌ Solo se permiten letras y espacios");
      userNameInput.focus();
      return false;
    }

    return true;
  }

  // Función para mostrar feedback de error
  function showErrorFeedback(message) {
    nameFeedback.textContent = message;
    nameFeedback.className = "input-feedback error";
    submitBtn.disabled = true;
  }

  // Función para mostrar feedback de éxito
  function showSuccessFeedback(message = "✅ ¡Perfecto!") {
    nameFeedback.textContent = message;
    nameFeedback.className = "input-feedback success";
    submitBtn.disabled = false;
  }

  // Función para limpiar feedback
  function clearFeedback() {
    nameFeedback.textContent = "";
    nameFeedback.className = "input-feedback";
    submitBtn.disabled = true;
  }

  // Función para mostrar mensaje de bienvenida personalizado
  function showWelcomeMessage(name, photo = null) {
    // Crear notificación de bienvenida
    const welcomeNotification = document.createElement("div");
    welcomeNotification.className = "welcome-notification";

    const photoHtml = photo
      ? `<img src="${photo}" alt="Tu foto" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,0.3); margin-right: 15px;">`
      : `<div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 1.5rem;">👤</div>`;

    welcomeNotification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        z-index: 10001;
        animation: slideInRight 0.5s ease;
        max-width: 350px;
        display: flex;
        align-items: center;
      ">
        ${photoHtml}
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 1.2rem;">¡Hola ${name}! 👋</h3>
          <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Bienvenido al portafolio de Jaime Mogollón</p>
        </div>
      </div>
    `;

    document.body.appendChild(welcomeNotification);

    // Remover notificación después de 5 segundos
    setTimeout(() => {
      welcomeNotification.style.animation = "slideOutRight 0.5s ease";
      setTimeout(() => {
        welcomeNotification.remove();
      }, 500);
    }, 5000);

    // Actualizar el título de la página
    document.title = `Portafolio - ${name}`;
  }
}

// Agregar estilos CSS para las animaciones de notificación
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);
