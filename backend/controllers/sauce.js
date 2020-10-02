const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    ...req.body
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Post saved successfully!'}))
  .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then((thing) => res.status(200).json(thing))
  .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    _id: req.params.id,
    ...req.body
  });
  Sauce.updateOne({_id: req.params.id}, sauce)
  .then(() => res.status(201).json({ message: 'Sauce updated successfully!' }))
  .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id})
  .then(() => res.status(200).json({ message: 'Deleted!' }))
  .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({ error }));
};