var User = require('../models/user.js');

exports.edit_email_get = function(req, res, next) {
	res.render('cambiarEmail');
}

exports.edit_email_post = function(req, res, next) {
	console.log("Email introducido " + req.body.email);
	let sesionUser = req.user.email;
	console.log("Ha entrado a email, con la sesion de: " + sesionUser);

	User.countDocuments({ email: req.body.email }, function(error, count) {
		if(count > 0){
			console.log('El email introducido ya existe');
			let errorMessage = `<div class="errorMessage"><i class="fas fa-exclamation-triangle"></i>El email introducido ya existe</div>`;
			req.flash('errorMessage', errorMessage);
			res.redirect('back');
		}  
		else 
		{

			User.findOneAndUpdate( {email: sesionUser}, {$set: {email: req.body.email} }, {
				new: true,
				runValidators: true
			})
				.then( doc => {
					console.log(doc);
					console.log('cambio de email realizado con exito');
					let successMessage = `<div class="successfullMessage"><i class="fas fa-check"></i>Los cambios se han realizado correctamente</div>`;
					req.flash('successMessage', successMessage);
					res.redirect('back');
				})
				.catch(err => {
					console.log(err);
				});	

		}

	});	
}