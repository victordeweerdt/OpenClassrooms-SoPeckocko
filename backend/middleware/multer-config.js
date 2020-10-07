// On déclare le plugin qui nous intéresse

const multer = require('multer');

// On spécifie les types de fichiers que l'on va gérer

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On crée un middleware qui va récupérer le fichier envoyé
// Et qui le renommer avec la date du téléchargement pour en faire des fichiers uniques

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// On exporte le module.

module.exports = multer({storage: storage}).single('image');