// module.exports = function validateCookie(req, res, next) {
//     const { cookies } = req;
//     if ('session_id' in cookies) {
//         console.log('it exists');
//         if (cookies.session_id === '1234567') {
//             next();
//         } else {
//             res.status(403).send({ error });
//         }
//     } else {
//         res.status(403).send({ error });
//     }
//     next();
// }