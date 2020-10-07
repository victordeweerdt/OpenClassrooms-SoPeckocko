// On déclare les plugins qu'on va utiliser dans ce fichier

const express = require('express');
const bodyParser = require('body-parser'); // Package qui va transformer en JSON les elements du HTML
const mongoose = require('mongoose'); // Package pour communiquer avec MongoDB
const path = require('path');
const cookieParser = require('cookie-parser'); // Package pour la mise en cookie du token

// Connection avec MongoDB

mongoose.connect('mongodb+srv://Boris:dCohnP49zWyMZXYO@cluster0.ehlt2.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// On déclare nos routes

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Déclaration de l'app express

const app = express();

// Les headers suivants nous permettent d'accéder à notr API depuis n'importe quelle origine.

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

// On crée l'URI de nos routes

app.use('/images', express.static(path.join(__dirname, 'images'))); // Chemin pour les fichiers statics
app.use('/api/sauces', sauceRoutes); // Routes concernants nos sauces
app.use('/api/auth', userRoutes); // Routes concernants nos utilisateurs

// On exporte notre application

module.exports = app;