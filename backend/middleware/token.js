// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     console.log(bearerHeader);
//     if (typeof bearerHeader !== 'undefined') { // Je vérifie que mon token existe
//         const bearer = bearerHeader.split(" "); // Je récupère le numéro après le mot bearer
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403); // Requete de non permission
//     }
// }

// module.exports = function verifyAuthToken(req, res, next) {
//     const { authorization } = req.headers;
//     if (authorization && authorization === 'RANDOM_TOKEN_SECRET') {
//         next();
//     } else {
//         res.status(403).send({ error: 'Accès interdit' });
//     }
// }