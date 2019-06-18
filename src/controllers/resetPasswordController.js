var User = require('../models/user.js');
const async = require('async');
var crypto = require('crypto');
const nodemailer = require('nodemailer');
const keys = require('../keys');

exports.resetpassword_get = function(req, res) {
	res.render('resetPassword');
	token = req.params.token;

}

exports.resetpassword_post = function(req, res,next) {
	emailOfUser = "";
	usernameOfUser = "";

	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() }}, function(err, user) {
				if(!user) {
					req.flash('errorMessage', 'Password token invalido o no encontrado');
					return res.redirect('back');
				}
				user.password = user.encryptPassword(req.body.password);
				user.resetPasswordToken = null;
				user.resetPasswordExpires = null;

				emailOfUser = user.email;

				usernameOfUser = user.username;
				console.log('GUARDANDO..');

				user.save(function (err) {
					return done(err, user);
				});

			});
		},

		function(user, done){
			console.log('SMTP FUNCTION');
			var smtpTransport = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true, 
				auth: {
				  user: keys.credentials.mail,
				  pass: keys.credentials.password
				}

			});

			var mailOptions = {
				from: '"Pintalo.io Support" <luisjakevs@gmail.com>',
				to: emailOfUser,
				subject: 'Tu contraseña en pintalo.io ha sido cambiada',
				text: 'Esto es una confirmación de que tu cuenta ' + usernameOfUser + ' ha sido cambiada correctamente'
			};
			
			console.log('Email redactado');
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log('email enviado');
				let successMessage = `<div class="successfullMessage">Tu contraseña ha sido cambiada correctamente</div>`;
				req.flash('successMessage', successMessage);
				done(err, 'done');
			});
		}

	], function(err) {
		if(err) return next(err);
		res.redirect('/');
	});
}