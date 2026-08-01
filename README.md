# LM Rénov - Site vitrine

Site web statique responsive en HTML/CSS/JS pour une entreprise de rénovation.

## Structure
- `index.html` : structure de la page
- `styles.css` : styles et responsive
- `script.js` : interactions et animations

## Utilisation
Ouvrez `index.html` dans votre navigateur pour voir le site.

## Déploiement
Vous pouvez héberger ce site sur GitHub Pages, Netlify ou Firebase Hosting.

### Hébergement sur Google avec Firebase Hosting
1. Installez `npm` si nécessaire.
2. Installez Firebase CLI :
   - `npm install -g firebase-tools`
3. Dans le dossier du projet :
   - `firebase login`
   - `firebase init hosting`
     - Choisissez votre projet Firebase
     - Pour le dossier public, saisissez `.`
     - Répondez `non` à la configuration d’application single-page si vous n’utilisez pas de routage SPA
4. Déployez le site :
   - `firebase deploy`

Une fois déployé, votre site sera disponible sur :
- `https://<nom-de-votre-projet>.web.app`
- `https://<nom-de-votre-projet>.firebaseapp.com`

### Ajouter des photos de réalisations depuis Facebook
1. Ouvrez votre post Facebook avec un navigateur connecté à votre compte.
2. Téléchargez les photos de réalisations sur votre ordinateur.
3. Copiez-les dans un dossier `images/` à la racine du projet.
4. Remplacez les images de la section `#gallery` dans `index.html` par les fichiers téléchargés, par exemple :
   - `images/realisations-1.jpg`
   - `images/realisations-2.jpg`
   - `images/realisations-3.jpg`
   - `images/realisations-4.jpg`
5. Rechargez le site pour afficher vos vraies réalisations.

---

Fichier fusionné automatiquement pour résoudre un conflit de merge lors du push vers le remote.
