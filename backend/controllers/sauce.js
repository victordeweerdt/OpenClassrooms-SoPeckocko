// On déclare les plugins que nous allons utiliser

const fs = require('fs');
const regex = /[a-zA-Z0-9 _.,'’(Ééèàû)&]+$/;

// Import du model Sauce

const Sauce = require('../models/sauce');

// Je crée la fonction qui va nous permettre de créer une sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) || // On crée ici des regex sur nos champs pour éviter des insertions.
        !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) || // Et donc renforcer la sécurité
        !regex.test(sauceObject.heat)) {
        return res.status(500).json({ error: 'Des caractères invalides se trouvent dans vos champs.' });
    }  else {
      const sauce = new Sauce({ // La sauce est créée grâce à notre modèle
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0, // On initialise les likes à 0
        dislikes: 0, // On initialise les dislikes à 0
        usersLiked: [], // On initialise le tableau des likeurs
        usersDisliked: [] // On initialise le tableau des dislikeurs
      });

      sauce.save() // On enregistre la sauce
      .then(() => res.status(201).json({ message: 'Sauce bien enregistrée !'}))
      .catch((error) => res.status(400).json({ error }));
  }
};

// Je crée la fonction qui va nous permettre de récupérer une sauce

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // On récupère l'id de la sauce dans l'URL
  .then((thing) => res.status(200).json(thing))
  .catch((error) => res.status(404).json({ error }));
};

// Je crée la fonction qui va nous permettre de modifier une sauce

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // On vérifie que la sauce existe
  {
    ...JSON.parse(req.body.sauce), // Si oui, on récupère tous les champs
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // On actualise l'URL ainsi que l'objet sauce
  .then(() => res.status(201).json({ message: 'Sauce modifée avec succès !' }))
  .catch((error) => res.status(400).json({ error }));
};

// Je crée la fonction qui va nous permettre de supprimer une sauce

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Je récupère la sauce grâce aux params
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => { // Je supprimer l'image en lien grâce à la méthode unlink du package fs
      Sauce.deleteOne({ _id: req.params.id }) // On supprime l'objet
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

// Je crée la fonction qui va nous permettre de voir toutes nos sauces

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({ error }));
};

// Function qui va gérer les likes et dislikes
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Je récupère la sauce grâce aux params
 .then(sauce => {
     switch (req.body.like) { // On utlise un switch case pour interpréter les différentes possiblités
         case -1: // Dans le cas d'un dislike
             Sauce.updateOne({ _id: req.params.id }, {
                 $inc: {dislikes:1}, // L'utilsateur a disliké
                 $push: {usersDisliked: req.body.userId}, // On stocke son id dans le tableau de dislikeurs
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                 .catch( error => res.status(400).json({ error }))
             break;
         case 0: // Quand l'utilisateur retire son vote
             if (sauce.usersLiked.find(user => user === req.body.userId)) {
                 Sauce.updateOne({ _id : req.params.id }, {
                     $inc: {likes:-1}, // L'utilsateur a enlevé son like
                     $pull: {usersLiked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Like retiré !'}))
                     .catch( error => res.status(400).json({ error }))
             }
             if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                 Sauce.updateOne({ _id : req.params.id }, {
                     $inc: {dislikes:-1}, // L'utilsateur a enlevé son dislike
                     $pull: {usersDisliked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                     .catch( error => res.status(400).json({ error }));
             }
             break;
         case 1: // Dans le cas d'un like
             Sauce.updateOne({ _id: req.params.id }, {
                 $inc: { likes:1}, // L'utilisateur a liké.
                 $push: { usersLiked: req.body.userId},
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                 .catch( error => res.status(400).json({ error }));
             break;
         default:
             return res.status(500).json({ error });
     }
 })
 .catch(error => res.status(500).json({ error }))
};