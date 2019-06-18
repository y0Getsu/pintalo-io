var User = require('../models/user.js');

exports.edit_user_get = function(req, res, next) {
	res.render('cambiarNombre');
}

exports.edit_user_post = function(req, res, next) {
	console.log("Nombre de usuario introducido " + req.body.username);
	let sesionUser = req.user.username;
	console.log("Ha entrado a username, con la sesion de: " + sesionUser);

	User.countDocuments({ username: req.body.username }, function(err, count) {
		if(count > 0){
			console.log('El usuario introducido ya existe');
			let errorMessage = `<div class="errorMessage"><i class="fas fa-exclamation-triangle"></i>El usuario introducido ya existe</div>`;
			req.flash('errorMessage', errorMessage);
			res.redirect('back');
			
		}  
		else 
		{

			User.findOneAndUpdate( {username: sesionUser}, {$set: {username: req.body.username.toLowerCase()}}, {
				new: true,
				runValidators: true
			})
				.then( doc => {
					console.log(doc);
					console.log('cambio de usuario realizado con exito');
					let successMessage = `<div class="successfullMessage"><i class="fas fa-check"></i>Los cambios se han realizado correctamente</div>`;
					req.flash('successMessage', successMessage);
					res.redirect('/profile/'+req.user.username+'/edit/edit-name');
					
				})
				.catch(err => {
					console.log(err);

				});	

		}

	});	
}