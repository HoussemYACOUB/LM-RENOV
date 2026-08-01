import { Navigation } from './navigation.js';
import { WebAnimations } from './animations.js';
import { Testimonials } from './testimonials.js';
import { ContactForm } from './contact.js';
import { BarcodeScanner } from './scanner.js';

class App {
  static init() {
    new Navigation();
    new Testimonials();
    new ContactForm();
    new BarcodeScanner();
    
    WebAnimations.initReveal();
    WebAnimations.populateFooterYear();
  }
}

document.addEventListener('DOMContentLoaded', App.init);
