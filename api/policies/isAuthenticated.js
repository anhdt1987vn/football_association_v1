/**
 * isAuthenticated
 * @description :: Policy that inject user in `req` via JSON Web Token
 */

var passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('jwt', function (error, user, info) {
        if (error){
        	console.log("ERROR");
        	return res.serverError(error);
        }
        
        if (!user){ 
        	console.log("!USER");
        	return res.unauthorized(null, info && info.code, info && info.message);
        }
        console.log(user);
        console.log(typeof(user));
        console.log(user['email']);
        req.user = user;

        next();
    })(req, res);
};
