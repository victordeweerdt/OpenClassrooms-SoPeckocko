// On déclare notre framework Express

const express = require('express');
const router = express.Router();

// On déclare les middlewares qu'on va utiliser dans ce fichier

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// On fait le lien avec notre controller

const sauceCtrl = require('../controllers/sauce');

// Puis on crée nos différentes routes liées aux sauces
// En spécifiant les types de requètes (POST, GET, PUT & DELETE)

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// On exporte le module.

module.exports = router;