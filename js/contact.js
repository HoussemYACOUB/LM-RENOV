export class ContactForm {
  constructor() {
    this.form = document.getElementById('quote-form');
    this.formStatus = document.getElementById('form-status');
    this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
    this.init();
  }

  init() {
    if (!this.form || !this.formStatus) return;

    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(this.form);
      const name = formData.get('name')?.toString().trim() || 'Client';
      const email = formData.get('email')?.toString().trim();
      const phone = formData.get('phone')?.toString().trim();
      const message = formData.get('message')?.toString().trim();

      if (this.submitBtn) {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span>Envoi en cours...</span>';
      }

      this.formStatus.textContent = 'Envoi de votre demande de devis en cours...';

      try {
        // Option 1 : Utilisation de Formspree / Webhook HTTP
        const response = await fetch('https://formspree.io/f/xgeggplb', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.formStatus.textContent = `✅ Merci ${name} ! Votre demande a été envoyée avec succès. Nous vous contacterons par téléphone/email sous 24h.`;
          this.form.reset();
        } else {
          // Fallback gracieux mailto si le service n'est pas encore configuré
          this.triggerMailtoFallback(name, email, phone, message);
        }
      } catch (error) {
        console.warn('Fallback mailto suite à une erreur réseau:', error);
        this.triggerMailtoFallback(name, email, phone, message);
      } finally {
        if (this.submitBtn) {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = `<span>Envoyer mon message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        }
      }
    });
  }

  triggerMailtoFallback(name, email, phone, message) {
    const subject = encodeURIComponent(`Demande de devis LM Rénov - ${name}`);
    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\n\nMessage / Projet:\n${message}`
    );
    window.location.href = `mailto:contact@lmrenov.fr?subject=${subject}&body=${body}`;
    this.formStatus.textContent = `Veuillez confirmer l'envoi de l'email via votre logiciel de messagerie qui vient de s'ouvrir. Merci ${name} !`;
    this.form.reset();
  }
}
