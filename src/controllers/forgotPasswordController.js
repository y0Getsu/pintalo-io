var User = require('../models/user.js');
const async = require('async');
var crypto = require('crypto');
const nodemailer = require('nodemailer');
const keys = require('../keys');

exports.forgotpassword_get = function(req, res) {
	res.render('forgotPassword');
}

exports.forgotpassword_post = function(req, res,next) {
	async.waterfall([
		function(done){
			crypto.randomBytes(20, function (err, buf) {
				token = buf.toString('hex');
				console.log('Token creado: ' + token);
				done(err, token);
			});
		},

		function(token, done){
			User.findOneAndUpdate({email: req.body.email},{ $set:{ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000} },
			{upsert: true}, function (err, user) {
				if(!user){
					let errorMessage = `<div class="errorMessage">El email introducido no existe</div>`;
					req.flash('errorMessage',errorMessage);
					return res.redirect('back');
				}
				/*
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000;
				*/
				user.save(function (err) {
					return done(err, token, user);
				});

				console.log('USER: ' + user);
			});
		},

		function(token, user, done){
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
				to: req.body.email,
				subject: 'Renueva tu contraseña en pintalo.io',
				text: 'Estas recibiendo este email porque tu o alguien ha enviado una petición para poder renovar tu contraseña\n\n' + 
					'Por favor comprueba el siguiente link, o copialo en tu navegador para poder completar el proceso\n\n ' + 
					'http://pintalo-io.herokuapp.com/reset-password/' + token + '\n\n' + 
					'Si no has enviado esta petición, por favor ignora este email y no se hará ningún cambio en tu cuenta\n' +
					'Un saludo!'
			};
			console.log('Email redactado');
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log('email enviado');
				let successMessage = `<div class="successfullMessage">Un email ha sido enviado a ${req.body.email} con las instrucciones</div>`;
				req.flash('successMessage', successMessage);
				done(err, 'done');
			});
		}

	], function(err) {
		if(err) return next(err);
		res.redirect('back');
	});
}