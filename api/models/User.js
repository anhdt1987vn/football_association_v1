/**
 * User
 * @description :: Model for storing users
 */
var randomstring = require("randomstring");
module.exports = {
    schema: true,

    attributes: {
        username: {
            type: 'string',
            //required: true,
            unique: true,
            alphanumericdashed: true
        },

        password: {
            type: 'string'
        },

        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },

        firstName: {
            type: 'string',
            defaultsTo: ''
        },

        lastName: {
            type: 'string',
            defaultsTo: ''
        },

        photo: {
            type: 'string',
            defaultsTo: '',
            url: true
        },

        socialProfiles: {
            type: 'object',
            defaultsTo: {}
        },

        refresh_token: {
            type: 'string',
            defaultsTo: randomstring.generate()
        },

        limit_of_refresh_token: {
            type: 'integer',
            defaultsTo: 25
        },

        owner: {
            model: 'club'
        },

        toJSON: function () {
            var obj = this.toObject();

            delete obj.password;
            delete obj.socialProfiles;
            delete obj.refresh_token;
            delete obj.limit_of_refresh_token;

            return obj;
        }
    },

    beforeUpdate: function (values, next) {
        CipherService.hashPassword(values);
        next();
    },

    beforeCreate: function (values, next) {
        CipherService.hashPassword(values);
        //CipherService.createRefreshToken(values);
        next();
    }
};
