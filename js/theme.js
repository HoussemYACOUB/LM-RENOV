export class ThemeManager {
  constructor() {
    this.toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    this.init();
  }

  init() {
    // 1. Charger la préférence enregistrée ou déterminer selon l'heure (Nuit de 19h à 7h)
    const savedTheme = localStorage.getItem('lmrenov-theme');
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const currentHour = new Date().getHours();
      // Si entre 19h et 7h du matin = Mode Sombre (Dark), sinon Mode Jour (Light)
      const isNight = currentHour >= 19 || currentHour < 7;
      this.setTheme(isNight ? 'dark' : 'light');
    }

    this.toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('lmrenov-theme', newTheme);
      });
    });
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
