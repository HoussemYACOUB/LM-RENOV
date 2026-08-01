export class ContactForm {
  constructor() {
    this.form = document.getElementById('quote-form');
    this.formStatus = document.getElementById('form-status');
    this.init();
  }

  init() {
    if (!this.form || !this.formStatus) return;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(this.form);
      const name = data.get('name')?.toString().trim() || 'client';

      this.formStatus.textContent = `Merci ${name} ! Votre demande a bien été reçue. Nous revenons vers vous rapidement.`;
      this.form.reset();
    });
  }
}
