const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
      // On récupère tout ce qui se trouve après l'espace dans le header
    const token = req.headers.authorization.split(' ')[1];
    // On le décode
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // On le compare à l'Id de l'utilisateur
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