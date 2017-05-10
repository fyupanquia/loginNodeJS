var express = require('express'),
	router  = express.Router(),
	User 	= require('../models/user'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy

	// Register
	router.get('/register', function (req, res){
		res.render('register')
	})
	// Login 
	router.get('/login', function (req, res){
		res.render('login')
	})
	// Register User
	router.post('/register', function (req, res){
		var name 		= req.body.name,
			email 		= req.body.email,
			username 	= req.body.username,
			password 	= req.body.password,
			passwords 	= req.body.passwords

			req.checkBody('name', 'Name is required').notEmpty()
			//req.checkBody('email', 'Email is required').notEmpty()
			//req.checkBody('email', 'Email is not valid').isEmail()
			req.checkBody('username', 'Username hasnt a email format').isEmail()
			req.checkBody('username', 'Username is required').notEmpty()
			req.checkBody('password', 'Password is required').notEmpty()
			req.checkBody('passwords', 'Passwords do not match').equals( req.body.password )

			var errors = req.validationErrors()

			if(errors){
				res.render('register',{
					errors:errors
				})
			}else{
				console.log('it is OK')
				var newUser = new User({
					name: name,
					email: email,
					username : username,
					password: password
				})

				User.createUser(newUser, function(err, user) {
					if(err) throw err
						console.log(user)
				})

				req.flash('success_msg','You are registered and can now login')
				res.redirect('/users/login')
			}
	})

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	passport.use(new LocalStrategy(
		function(username, password, done){
			User.getUserByUsername(username,function(err, user){

				if(err) throw err;
				if(!user){
					return done(null, false, {message: 'Unknown User'})
				}

				User.comparePassword(password,user.password, function(err, isMatch){
					if(err) throw err;
					if(isMatch){
						return done(null, user)
					}else{
						return done(null, false,{message: 'Invalid password'})
					}
				})

			})
		}))

	// LOGIN USER
	router.post('/login',passport.authenticate('local',
														{successRedirect:'/',
														 failureRedirect:'/users/login',
														 failureFlash:true}),function(req, res) {
    res.redirect('/');
  })
	// LOG OUT USER
	router.get('/logout',function(req, res){
		req.logout()

		req.flash('success_msg','You are logged out')
		res.redirect('/users/login')
	})

	
	
	module.exports = router 