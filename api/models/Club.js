/**
 * Club.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	schema: true,

	attributes: {
		name: {
			type: 'string',
			required: true,
			unique: true,
			alphanumericdashed: true	
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

	    slogan: {
	    	type: 'string',
	    	alphanumericdashed: true,
	    	defaultsTo: ''
	    },

	    members: {
	    	type: 'integer',
	    	defaultsTo: 10,
	    	min: 7,
	    	max: 15
	    },

	    users: {
	    	collection: 'user',
	    	via: 'owner'
	    }
    },
};

