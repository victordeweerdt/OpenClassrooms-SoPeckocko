// On déclare notre framework Express

const express = require('express');
const router = express.Router();

// On fait le lien avec notre controller

const userCtrl = require('../controllers/user');

// Puis on crée nos différentes routes liées aux utilisateurs
// En spécifiant qu'on a uniquement à faire ici à des requètes de type POST

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// On exporte le module.

module.exports = router;