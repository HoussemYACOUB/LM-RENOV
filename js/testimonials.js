export class Testimonials {
  constructor() {
    this.testimonialElement = document.getElementById('testimonial');
    this.testimonialDots = Array.from(document.querySelectorAll('.dot'));
    this.testimonials = [
      '“Professionnalisme, écoute et rendu final très propre. Merci LM Rénov !”',
      '“Un chantier bien organisé, propre et livré dans les délais.”',
      '“Besoin de rénovation ? Ils savent transformer un espace avec goût.”'
    ];
    this.testimonialIndex = 0;
    this.testimonialTimer = null;
    this.init();
  }

  init() {
    if (!this.testimonialElement || this.testimonialDots.length === 0) return;

    this.testimonialDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        this.testimonialIndex = Number(dot.dataset.index);
        this.updateTestimonial();
        this.resetTestimonialTimer();
      });
    });

    this.updateTestimonial();
    this.startTimer();
  }

  updateTestimonial() {
    if (!this.testimonialElement) return;
    this.testimonialElement.textContent = this.testimonials[this.testimonialIndex];
    this.testimonialDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.testimonialIndex);
    });
  }

  startTimer() {
    this.testimonialTimer = window.setInterval(() => {
      this.testimonialIndex = (this.testimonialIndex + 1) % this.testimonials.length;
      this.updateTestimonial();
    }, 5000);
  }

  resetTestimonialTimer() {
    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
      this.startTimer();
    }
  }
}
