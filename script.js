const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.getElementById('year');
const form = document.getElementById('quote-form');
const formStatus = document.getElementById('form-status');
const testimonialElement = document.getElementById('testimonial');
const testimonialDots = Array.from(document.querySelectorAll('.dot'));
const scanner = {
  video: document.getElementById('barcode-video'),
  status: document.getElementById('scanner-status'),
  startButton: document.getElementById('start-scan'),
  stopButton: document.getElementById('stop-scan'),
  detector: null,
  stream: null,
  active: false,
  commercialUrl: 'https://votre-site-commercial.com'
};

const testimonials = [
  '“Professionnalisme, écoute et rendu final très propre. Merci LM Rénov !”',
  '“Un chantier bien organisé, propre et livré dans les délais.”',
  '“Besoin de rénovation ? Ils savent transformer un espace avec goût.”'
];

let testimonialIndex = 0;
let testimonialTimer = null;

function init() {
  setupNavigation();
  populateYear();
  initRevealAnimations();
  initTestimonials();
  initContactForm();
  initBarcodeScanner();
}

function setupNavigation() {
  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function populateYear() {
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initTestimonials() {
  if (!testimonialElement || testimonialDots.length === 0) {
    return;
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      testimonialIndex = Number(dot.dataset.index);
      updateTestimonial();
      resetTestimonialTimer();
    });
  });

  updateTestimonial();
  testimonialTimer = window.setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    updateTestimonial();
  }, 5000);
}

function updateTestimonial() {
  if (!testimonialElement) {
    return;
  }

  testimonialElement.textContent = testimonials[testimonialIndex];
  testimonialDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === testimonialIndex);
  });
}

function resetTestimonialTimer() {
  if (testimonialTimer) {
    clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
      updateTestimonial();
    }, 5000);
  }
}

function initContactForm() {
  if (!form || !formStatus) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || 'client';

    formStatus.textContent = `Merci ${name} ! Votre demande a bien été reçue. Nous revenons vers vous rapidement.`;
    form.reset();
  });
}

function initBarcodeScanner() {
  if (!scanner.video || !scanner.status || !scanner.startButton || !scanner.stopButton) {
    return;
  }

  if (!('BarcodeDetector' in window)) {
    scanner.status.textContent = 'Ce navigateur ne prend pas en charge le scanner. Utilisez Chrome ou Edge récent.';
    scanner.startButton.disabled = true;
    scanner.stopButton.disabled = true;
    return;
  }

  scanner.detector = new BarcodeDetector({
    formats: ['ean_13', 'code_128', 'qr_code', 'ean_8', 'upc_a', 'upc_e']
  });

  scanner.startButton.addEventListener('click', startBarcodeScanner);
  scanner.stopButton.addEventListener('click', stopBarcodeScanner);
}

async function startBarcodeScanner() {
  if (scanner.active) {
    return;
  }

  try {
    scanner.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    scanner.video.srcObject = scanner.stream;
    await scanner.video.play();
    scanner.active = true;
    scanner.status.textContent = 'Caméra activée. Approchez un code-barres.';
    scanBarcodeFrame();
  } catch (error) {
    scanner.status.textContent = 'Impossible d’accéder à la caméra. Vérifiez vos autorisations.';
    console.error(error);
  }
}

function stopBarcodeScanner() {
  scanner.active = false;

  if (scanner.stream) {
    scanner.stream.getTracks().forEach((track) => track.stop());
    scanner.stream = null;
  }

  if (scanner.video) {
    scanner.video.srcObject = null;
  }

  scanner.status.textContent = 'Scanner arrêté. Cliquez sur démarrer pour relancer.';
}

async function scanBarcodeFrame() {
  if (!scanner.active || !scanner.detector || !scanner.video) {
    return;
  }

  if (scanner.video.readyState < 2) {
    requestAnimationFrame(scanBarcodeFrame);
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = scanner.video.videoWidth;
  canvas.height = scanner.video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(scanner.video, 0, 0, canvas.width, canvas.height);

  try {
    const barcodes = await scanner.detector.detect(canvas);

    if (barcodes.length > 0) {
      handleScannedBarcode(barcodes[0].rawValue);
      return;
    }
  } catch (error) {
    console.error(error);
  }

  if (scanner.active) {
    setTimeout(() => requestAnimationFrame(scanBarcodeFrame), 200);
  }
}

function handleScannedBarcode(value) {
  stopBarcodeScanner();
  scanner.status.textContent = `Code détecté : ${value}. Redirection vers le site commercial...`;

  setTimeout(() => {
    window.location.href = `${scanner.commercialUrl}/?code=${encodeURIComponent(value)}`;
  }, 1000);
}

init();
