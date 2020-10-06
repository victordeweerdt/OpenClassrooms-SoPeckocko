const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import du model User
const User = require('../models/user');

// Version 1.0
exports.signup = (req, res, next) => {
    // je hash mon mot de passe et le sale 10 fois
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const user = new User({
          email: req.body.email,
          password: hash
        });
        console.log("Email créé : ", req.body.email);
        console.log("Password hashé : ", hash);
        // J'enregistre mon utilisateur
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
    // Je cherche dans ma base de données si mon utilisateur existe
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Je cherche ensuite si le mot de passe associé crypté, peut correspondre au mot de passe crypté de ma BDD
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Le token suivant va nous permettre de créer une clé d'authentification pour chaque utilisateur
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' } // À vérifier RGPD
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      // .then(() => res.status(200).json(token))
      .catch(error => res.status(500).json({ error }));
      // console.log(req.headers['authorization']);
      // res.cookie('authorization', '123');
      // res.status(200).json({ message: 'Cookie en place'});
  };