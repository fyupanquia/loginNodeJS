var express = require('express'),
	router  = express.Router()

	//Get HomePage
	router.get('/',ensureAuthenticated, function (req, res){
		res.render('index')
	})

	function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}else{
			//req.flash('error_msg','You are not logged in')
			req.flash('error_msg','You are not logged in')
			res.redirect('/users/login')
		}
	}

	module.exports = router 