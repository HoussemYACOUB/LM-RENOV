export class WebAnimations {
  static initReveal() {
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
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  static populateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear());
    }
  }
}
