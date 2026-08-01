export class BarcodeScanner {
  constructor() {
    this.status = document.getElementById('scanner-status');
    this.startButton = document.getElementById('start-scan');
    this.stopButton = document.getElementById('stop-scan');
    this.readerDiv = document.getElementById('barcode-video');
    this.html5QrCode = null;
    this.active = false;
    this.commercialUrl = 'https://houssemyacoub.github.io/LM-RENOV/';
    this.init();
  }

  init() {
    if (!this.status || !this.startButton || !this.stopButton || !this.readerDiv) return;

    this.startButton.addEventListener('click', () => this.startBarcodeScanner());
    this.stopButton.addEventListener('click', () => this.stopBarcodeScanner());
  }

  async startBarcodeScanner() {
    if (this.active) return;

    try {
      this.status.textContent = 'Initialisation de la caméra...';

      if (typeof Html5Qrcode === 'undefined') {
        this.status.textContent = 'Chargement de la bibliothèque de scan... veuillez réespayer dans un instant.';
        return;
      }

      // Si le conteneur est un élément vidéo, remplacer dynamiquement par un div pour Html5Qrcode
      if (this.readerDiv.tagName.toLowerCase() === 'video') {
        const parent = this.readerDiv.parentNode;
        const newDiv = document.createElement('div');
        newDiv.id = 'barcode-video';
        newDiv.style.width = '100%';
        newDiv.style.borderRadius = '12px';
        newDiv.style.overflow = 'hidden';
        parent.replaceChild(newDiv, this.readerDiv);
        this.readerDiv = newDiv;
      }

      this.html5QrCode = new Html5Qrcode('barcode-video');

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      // Tenter d'utiliser la caméra arrière ({ facingMode: "environment" })
      await this.html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText, decodedResult) => {
          this.handleScannedBarcode(decodedText);
        },
        (errorMessage) => {
          // Erreur de scan continue (normale tant qu'aucun code n'est aligné)
        }
      );

      this.active = true;
      this.status.textContent = '📸 Caméra active ! Placez un QR Code ou un code-barres devant l’objectif.';
    } catch (error) {
      console.error('Erreur démarrage scanner:', error);
      this.status.textContent = '⚠️ Accès caméra refusé ou non disponible. Veuillez autoriser la caméra dans votre navigateur.';
    }
  }

  async stopBarcodeScanner() {
    if (!this.active || !this.html5QrCode) return;

    try {
      await this.html5QrCode.stop();
      this.active = false;
      this.status.textContent = 'Scanner arrêté. Cliquez sur "Démarrer" pour relancer.';
    } catch (error) {
      console.error('Erreur arrêt scanner:', error);
    }
  }

  handleScannedBarcode(value) {
    this.stopBarcodeScanner();
    this.status.textContent = `✅ Code scanné avec succès : ${value}`;

    // Si le code scanné est une URL, redirection directe, sinon alerte informative
    if (value.startsWith('http://') || value.startsWith('https://')) {
      this.status.textContent = `Redirection vers : ${value}...`;
      setTimeout(() => {
        window.location.href = value;
      }, 1200);
    } else {
      alert(`🎉 Code-barres / QR Code détecté :\n${value}`);
    }
  }
}
