export class BarcodeScanner {
  constructor() {
    this.video = document.getElementById('barcode-video');
    this.status = document.getElementById('scanner-status');
    this.startButton = document.getElementById('start-scan');
    this.stopButton = document.getElementById('stop-scan');
    this.detector = null;
    this.stream = null;
    this.active = false;
    this.commercialUrl = 'https://votre-site-commercial.com';
    this.init();
  }

  init() {
    if (!this.video || !this.status || !this.startButton || !this.stopButton) return;

    if (!('BarcodeDetector' in window)) {
      this.status.textContent = 'Ce navigateur ne prend pas en charge le scanner. Utilisez Chrome ou Edge récent.';
      this.startButton.disabled = true;
      this.stopButton.disabled = true;
      return;
    }

    this.detector = new BarcodeDetector({
      formats: ['ean_13', 'code_128', 'qr_code', 'ean_8', 'upc_a', 'upc_e']
    });

    this.startButton.addEventListener('click', () => this.startBarcodeScanner());
    this.stopButton.addEventListener('click', () => this.stopBarcodeScanner());
  }

  async startBarcodeScanner() {
    if (this.active) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.video.srcObject = this.stream;
      await this.video.play();
      this.active = true;
      this.status.textContent = 'Caméra activée. Approchez un code-barres.';
      this.scanBarcodeFrame();
    } catch (error) {
      this.status.textContent = 'Impossible d’accéder à la caméra. Vérifiez vos autorisations.';
      console.error(error);
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

  async scanBarcodeFrame() {
    if (!this.active || !this.detector || !this.video) return;

    if (this.video.readyState < 2) {
      requestAnimationFrame(() => this.scanBarcodeFrame());
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    try {
      const barcodes = await this.detector.detect(canvas);
      if (barcodes.length > 0) {
        this.handleScannedBarcode(barcodes[0].rawValue);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    if (this.active) {
      setTimeout(() => requestAnimationFrame(() => this.scanBarcodeFrame()), 200);
    }
  }

  handleScannedBarcode(value) {
    this.stopBarcodeScanner();
    this.status.textContent = `Code détecté : ${value}. Redirection vers le site commercial...`;
    setTimeout(() => {
      window.location.href = `${this.commercialUrl}/?code=${encodeURIComponent(value)}`;
    }, 1000);
  }
}
