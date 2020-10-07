// On déclare les plugins que nous allons utiliser

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import du model User

const User = require('../models/user');

// Je crée la fonction qui va concerner mon inscription

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // je hash mon mot de passe et le sale 10 fois
      .then(hash => {
          const user = new User({ // Je crée ensuite mon nouvelle utilisateur
          email: req.body.email,
          password: hash
        });
        user.save() // J'enregistre mon utilisateur
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Je crée la fonction qui va concerner ma connexion

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Je récupère l'adresse mail saisie
      .then(user => {
        if (!user) { // Je cherche si un tulisateur correspondant existe dans ma DB
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // Je cherche ensuite si le mot de passe associé crypté, peut correspondre au mot de passe crypté de ma DB
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ // On va créer ici un token avec le package jwt
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'GD7S8DJSHF8SD787SD67BS87DSDB',
                { expiresIn: '24h' }
                )
            });
          })
          // .then(res => {
          //   res.cookie('authcookie',token,{maxAge:900000,httpOnly:true})
          // })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};