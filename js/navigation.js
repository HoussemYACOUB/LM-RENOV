export class Navigation {
  constructor() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.navLinks) return;

    this.menuToggle.addEventListener('click', () => {
      const isOpen = this.navLinks.classList.toggle('open');
      this.menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    this.navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.navLinks.classList.remove('open'));
    });
  }
}
