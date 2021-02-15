const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
	console.log("req.body", req.body);
	const user = new User(req.body);
	user.save((err, user) => {
		if(err) {
			return res.status(400).json({
			err
			})
		}
		res.json({
			user
		});
	});
}


exports.signin = (req, res) => {
	// find the user based on email
	const {email, password} = req.body;
	User.findOne({email}, (err, user) => {
		if(err || !user){
			return res.status(400).json({
				error: "email does not match"
			})
		}
		// if user found make sure the email & password is correct
		if(!user.authenticate(password)){
			return res.status(401).json({
				error: "email does not match"
			})
		}
		const token = jwt.sign({_id: user._id}, 'abcdefgh');
		res.cookie('t', token, {expire: new Date() + 9999});
		const {_id, name, email, role} = user;
		return res.json({token, user: {_id, email, name, role}});


	})

};

exports.signout = (req, res) => {  
	res.clearCookie('t');
	res.json({message: "Signout success"});
};

exports.requireSignin = expressJwt({
	secret: "abcdefgh",
	algorithms: ['HS256'], 
}); 

exports.isAuth = (req, res, next) => {  
	let user = req.profile && req.profile._id == req.auth._id;
	if(!user){
		return res.status(403).json({
			error: "Access denied!!"
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {  
	if(typeof req.profile.role === 'undefined' || req.profile.role === 0) {
		return res.status(403).json({
			error: "Admin resourse! Access denied"
		});
	}
	next();
}