var User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

exports.reset_password_get = function(req, res) {
	res.render('cambiarPassword');
}

exports.reset_password_post = function(req, res,next) {
	console.log("Contraseña introducida " + req.body.password);
	let sesionUser = req.user.password;
	console.log("Ha entrado a password, con la sesion de: " + sesionUser);
	var newPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	console.log("Password encriptada: " + newPassword);


	User.findOneAndUpdate( {password: sesionUser}, {$set: {password: newPassword}}, {
		new: true,
		runValidators: true

	})
		.then( doc => {
			console.log(doc);
			console.log('cambio de contraseña realizado con exito');
			let successMessage = `<div class="successfullMessage"><i class="fas fa-check"></i>Los cambios se han realizado correctamente</div>`;
			req.flash('successMessage', successMessage);
			res.redirect('back');
			
		})
		.catch(err => {
			console.log(err);

		});	 	
}