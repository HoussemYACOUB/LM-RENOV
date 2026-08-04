export class WebAnimations {
  static initReveal() {
    const revealElements = document.querySelectorAll('.reveal, .service-card, .process-card, .realisation-card, .faq-item, .stat, .hero-highlights li');
    
    // Ajout automatique des classes 'reveal' sur les cartes principales si elles ne l'ont pas
    revealElements.forEach((el, index) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animation progressive des compteurs statistiques si l'élément contient un nombre
            if (entry.target.classList.contains('stat-number') || entry.target.querySelector('.stat-number')) {
              WebAnimations.animateCounters(entry.target);
            }

            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  static animateCounters(container) {
    const counters = container.querySelectorAll ? container.querySelectorAll('.stat-number') : [];
    counters.forEach((counter) => {
      const targetText = counter.textContent.trim();
      const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
      const suffix = targetText.replace(/[0-9]/g, '');
      
      if (!isNaN(targetNum) && targetNum > 0) {
        let start = 0;
        const duration = 1800; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = targetNum / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= targetNum) {
            counter.textContent = targetNum + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(start) + suffix;
          }
        }, stepTime);
      }
    });
  }

  static populateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear());
    }
  }
}
