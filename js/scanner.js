export class BarcodeScanner {
  constructor() {
    this.video = document.getElementById('barcode-video');
    this.status = document.getElementById('scanner-status');
    this.startButton = document.getElementById('start-scan');
    this.stopButton = document.getElementById('stop-scan');
    this.detector = null;
    this.stream = null;
    this.active = false;
    this.init();
  }

  init() {
    if (!this.video || !this.status || !this.startButton || !this.stopButton) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.status.textContent = "La caméra n'est pas prise en charge sur ce navigateur. Essayez Chrome ou Safari sur mobile.";
      return;
    }

    this.startButton.addEventListener('click', () => this.startBarcodeScanner());
    this.stopButton.addEventListener('click', () => this.stopBarcodeScanner());
  }

  async startBarcodeScanner() {
    if (this.active) return;

    try {
      this.status.textContent = 'Demande d’accès à la caméra...';
      
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      
      // Assurer la lecture automatique sur iOS Safari (playsinline)
      this.video.setAttribute('playsinline', 'true');
      await this.video.play();
      
      this.active = true;
      this.status.textContent = 'Caméra activée ! Alignez le code-barres ou le QR Code dans le cadre.';
      
      this.scanLoop();
    } catch (error) {
      console.error("Erreur caméra:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.status.textContent = 'Accès caméra refusé. Veuillez autoriser la caméra dans les réglages de votre navigateur.';
      } else if (error.name === 'NotFoundError') {
        this.status.textContent = 'Aucune caméra trouvée sur cet appareil.';
      } else {
        this.status.textContent = 'Erreur d’accès à la caméra. Assurez-vous d’utiliser un lien HTTPS sécurisé.';
      }
    }
  }

  stopBarcodeScanner() {
    this.active = false;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
    this.status.textContent = 'Scanner arrêté. Cliquez sur démarrer pour relancer.';
  }

  async scanLoop() {
    if (!this.active || !this.video) return;

    if (this.video.readyState < 2) {
      requestAnimationFrame(() => this.scanLoop());
      return;
    }

    // Utilisation de BarcodeDetector native si supportée
    if ('BarcodeDetector' in window) {
      try {
        if (!this.detector) {
          this.detector = new BarcodeDetector({
            formats: ['ean_13', 'code_128', 'qr_code', 'ean_8', 'upc_a', 'upc_e', 'data_matrix']
          });
        }
        const barcodes = await this.detector.detect(this.video);
        if (barcodes.length > 0) {
          this.handleScannedBarcode(barcodes[0].rawValue);
          return;
        }
      } catch (err) {
        console.warn("Scan frame error:", err);
      }
    } else {
      this.status.textContent = 'Caméra active. (Prise en charge de la détection automatique native sur Chrome/Edge/iOS 17+)';
    }

    if (this.active) {
      setTimeout(() => requestAnimationFrame(() => this.scanLoop()), 250);
    }
  }

  handleScannedBarcode(value) {
    this.stopBarcodeScanner();
    this.status.textContent = `✅ Code scanné avec succès : ${value}`;
    alert(`Code-barres / QR Code détecté : ${value}`);
  }
}
