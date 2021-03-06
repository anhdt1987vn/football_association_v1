/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
var passport = require('passport');

/**
 * Triggers when user authenticates via passport
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
 */
function _onPassportAuth(req, res, error, user, info) {
    if (error) return res.serverError(error);
    if (!user) return res.unauthorized(null, info && info.code, info && info.message);
    console.log("_onPassportAuth");
    console.log(user);
    return res.ok({
        // TODO: replace with new type of cipher service
        access_token: CipherService.createToken(user),
        refresh_token: user.refresh_token,
        limit_of_refresh_token: user.limit_of_refresh_token,
        user: user
    });
}

module.exports = {
    /**
     * Sign up in system
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    signup: function (req, res) {
        console.log(req.allParams());
        User
            .create(_.omit(req.allParams(), 'id'))  // underscore(_).omit() return copy of object , and filter 'id'
            .then(function (user) {
                return {
                    // TODO: replace with new type of cipher service
                    //token: CipherService.createToken(user),   // not return token
                    user: user
                };
            })
            .then(res.created)
            .catch(res.serverError);
    },

    /**
     * Sign in by local strategy in passport
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    signin: function (req, res) {
        console.log("SIGN_IN");
        passport.authenticate('local', _onPassportAuth.bind(this, req, res))(req, res);
    },

    /**
     * Authorization via social networks
     * @param req Request object
     * @param res Response object
     */
    social: function (req, res) {
        var type = req.param('type') ? req.param('type').toLowerCase() : '-';
        var strategyName = [type, 'token'].join('-');

        if (Object.keys(passport._strategies).indexOf(strategyName) === -1) {
            return res.badRequest(null, null, [type.slice(0, 1).toUpperCase(), type.slice(1), ' is not supported'].join(''));
        }

        passport.authenticate('jwt', function (error, user) {
            req.user = user;
            passport.authenticate(strategyName, _onPassportAuth.bind(this, req, res))(req, res);
        })(req, res);
    },

    /**
     * Accept JSON Web Token and updates with new one
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    refresh_token: function (req, res) {
        console.log(req.allParams());   // debug

        var refresh_token = req.param('refresh_token');
        var user_id = req.param('user_id');

        User.findOne({
                id: user_id,
                refresh_token: refresh_token
            })
            .exec(function (err, user){
                if(err){
                    return res.serverError(err);
                }
                if(!user){
                    console.log('Do not see user');     // debug
                    return res.notFound('Could not find user id: ' + user_id + ', sorry.');
                }
                //console.log(user.limit_of_refresh_token);      // debug

                if(user.limit_of_refresh_token > 0){
                    User.update({id: user_id}, {limit_of_refresh_token: user.limit_of_refresh_token - 1})
                    .exec(function (err, updated){
                        if (err) {
                            return res.serverError(err);
                        }
                        console.log("Updated: " + updated);     // debug
                        return res.ok({
                            access_token: CipherService.createToken(user),
                            limit_of_refresh_token: user.limit_of_refresh_token
                        });
                    });
                }else{
                    return res.refreshtokenExpried();
                }
                

                
            });

        //res.badRequest(null, null, 'Not implemented yet');
    }
};
