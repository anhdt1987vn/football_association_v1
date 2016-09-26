/**
 * UserController
 * @description :: Server-side logic for manage users
 */

module.exports = {


	/**start_DEBUG_ZONE */
	
	/**
	 * [getByID get informations of User by ID]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[user]}     [information of User]
	 */
	getByID: function(req, res){
		var userID = req.param('user_id');

		User.findOne({id: userID})
			.exec(function(err, user){
				if(err){
					return res.serverError(err);
				}
				if(!user){
					return res.notFound('Could not find user');
				}
				return res.ok({
					user: user
				});
			});
	}

	/**end_DEBUG_ZONE */

};
