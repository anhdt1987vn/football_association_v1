/**
 * 700 (Refresh Token Is Expried) Response
 *
 * The request has been fulfilled and resulted in a new resource being created.
 * Successful creation occurred (via either POST or PUT).
 * Set the Location header to contain a link to the newly-created resource (on POST).
 * Response body content may or may not be present.
 */

module.exports = function (data, code, message, root) {
	console.log("CODE: " + code + "__" + "MESSAGE: " + message + "__" + "ROOT: " + root + "__" + "This: " + this + "__" + "Data: " + data);
    var response = _.assign({
        code: code || 'REFRESH_TOKEN_IS_EXPRIED',
        message: message || 'Your refresh token is expried, please login again',
        data: data || {}
    }, root);

    this.req._sails.log.silly('Sent (700 REFRESH_TOKEN_IS_EXPRIED)\n', response);

    this.res.status(700);
    this.res.jsonx(response);
};
