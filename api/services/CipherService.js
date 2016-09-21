var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

module.exports = {
    secret: sails.config.jwtSettings.secret,
    issuer: sails.config.jwtSettings.issuer,
    audience: sails.config.jwtSettings.audience,

    /**
     * Hash the password field of the passed user.
     */
    hashPassword: function (user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
    },

    /**
     * Compare user password hash with unhashed password
     * @returns boolean indicating a match
     */
    comparePassword: function(password, user){
        return bcrypt.compareSync(password, user.password);
    },

    /**
     * Create a token based on the passed user
     * @param user
     */
    createToken: function(user){
        return jwt.sign({
                user: user.toJSON()
            },
            sails.config.jwtSettings.secret,
            {
                algorithm: sails.config.jwtSettings.algorithm,
                expiresIn: sails.config.jwtSettings.expiresIn,
                issuer: sails.config.jwtSettings.issuer,
                audience: sails.config.jwtSettings.audience
            }
        );
    },
  
    /**
     * Create a refresh token
     * @param  {[type]} user [description]
     * @return {string}      [refresh token with random string]
     */
    createRefreshToken: function(){
        return /*user.toJSON().id + '.' + */randomstring.generate();
        /*if(user.id){
            user.refresh_token = user.id + '.' + randomstring.generate();
        }*/
    }
};
