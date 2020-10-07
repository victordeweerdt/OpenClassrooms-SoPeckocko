// On déclare le plugin que nous allons utiliser
// Ici mongoose pour MongoDB et mongoose-unique-validator pour rendre un email unique

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// On crée notre modèle User

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// On exporte le module.

module.exports = mongoose.model('user', userSchema);