export class ThemeManager {
  constructor() {
    this.toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('lmrenov-theme');
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const currentHour = new Date().getHours();
      const isNight = currentHour >= 19 || currentHour < 7;
      this.setTheme(isNight ? 'dark' : 'light');
    }

    this.toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isDark = document.body.classList.contains('dark-theme') || document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('lmrenov-theme', newTheme);
      });
    });
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
