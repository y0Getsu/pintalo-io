var User = require('../models/user');

exports.first_page_get = function(req, res) {
	res.render('signin');
}

exports.signup_page_get = function(req, res) {
	res.render('signup');
}

exports.lobby_page_get = function(req, res) {
	res.render('lobby');	
}

exports.profile_page_get = function(req, res) {
	res.render('profile');	
}

exports.showprofile_page_get = function(req, res) {
	res.render('verPerfil');	
}

exports.edit_page_get = function(req, res) {
	res.render('modificarPerfil');	
}


exports.manual_page_get = function(req, res) {
	res.render('manual');	
}

exports.administration_page_get = function(req, res) {
	if(req.user.username == 'admin'){
		res.render('administrationPanel');	
	
	} else {
		res.redirect('back');
	}
}
	

exports.logout_get = function(req, res) {
	req.logout();
	res.redirect('/');	
}



