'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});


const gM = document.querySelector(".galeria-modal");
const iGM = document.querySelector(".galeria-modal img");

function fecharGaleria(){
    gM.style.visibility = "hidden";
    iGM.style.transform = "scale(0)";
}

function abrirGaleria(src){
    gM.style.visibility = "visible";
    iGM.style.transform = "scale(1)";
    iGM.src = src
}

//alert("Pagina en desarrollo")



/**
 * CONTACT FORM
 */

const contactForm = document.querySelector("[data-contact-form]");
const contactFields = contactForm?.querySelectorAll(".input-field");
const contactStatus = contactForm?.querySelector("[data-form-status]");
const whatsappNumber = "527751267530";

const setContactStatus = function (message, type) {
  if (!contactStatus) return;

  contactStatus.textContent = message;
  contactStatus.classList.remove("is-error", "is-success");
  contactStatus.classList.add(type === "success" ? "is-success" : "is-error");
};

const validatePhoneField = function (phoneField) {
  if (!phoneField) return;

  const digits = phoneField.value.replace(/\D/g, "");
  const isValidPhone = digits.length >= 10;

  phoneField.setCustomValidity(isValidPhone ? "" : "Ingrese un número válido de al menos 10 dígitos.");
};

const updateFieldState = function (field) {
  field.classList.toggle("is-invalid", !field.checkValidity());
};

contactFields?.forEach(function (field) {
  field.addEventListener("input", function () {
    if (field.name === "phone") {
      validatePhoneField(field);
    }

    updateFieldState(field);

    if (contactStatus?.textContent) {
      contactStatus.textContent = "";
      contactStatus.classList.remove("is-error", "is-success");
    }
  });
});

contactForm?.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameField = contactForm.elements.namedItem("name");
  const phoneField = contactForm.elements.namedItem("phone");
  const messageField = contactForm.elements.namedItem("message");

  validatePhoneField(phoneField);
  contactFields.forEach(updateFieldState);

  if (!contactForm.checkValidity()) {
    setContactStatus("Revise los campos marcados antes de enviar.", "error");
    contactForm.reportValidity();
    return;
  }

  const name = nameField.value.trim();
  const phone = phoneField.value.trim();
  const message = messageField.value.trim();
  const whatsappMessage = [
    "Hola, quiero solicitar información de AlexCars.",
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    "Mensaje:",
    message
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (!whatsappWindow) {
    window.location.href = whatsappUrl;
  }

  contactForm.reset();
  contactFields.forEach(function (field) {
    field.classList.remove("is-invalid");
  });
  setContactStatus("Te estamos redirigiendo a WhatsApp.", "success");
});

