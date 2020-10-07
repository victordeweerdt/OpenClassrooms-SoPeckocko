// On déclare le plugin qui nous intéresse

const jwt = require('jsonwebtoken');

// On crée le middleware qui va authentifié 
// le token présent dans notre header

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // On récupère tout ce qui se trouve après l'espace dans le header
    const decodedToken = jwt.verify(token, 'GD7S8DJSHF8SD787SD67BS87DSDB'); // On le décode
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};