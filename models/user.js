const mongoose = require('mongoose');
//const crypto = require('crypto');
//const uuidv1 = require('uuid');

const userSchema = new mongoose.Schema({
	name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32
		  },
	email: {
			type: String,
			trim: true,
			required: true,
			unique: true
		  },
    password: {
			type: String,
			trim: true,
			required: true,
			 
		  },
    role: {
			type: Number,
			trim: true,
			required: false,
			default: 0 
		  },
	}, 
	{timestamps: true}

);

// virtual field
 
 userSchema.methods = {
 	authenticate: function(plainText){
 		return plainText === this.password;
 	}
 }


module.exports = mongoose.model("User", userSchema);