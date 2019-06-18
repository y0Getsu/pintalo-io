const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //Conseguimos funcionalidad con passport

const User = require('../models/user');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

//Registrar usuario

passport.use('local-signup', 
	new LocalStrategy({
		usernamefield: 'username', //autentificaremos el username
		passwordField: 'password', //autentificaremos el password
		emailField: 'email',
		passReqToCallback: true //poder almacenar mas campos
	}, async (req, username, password, done) => {

		const user = await User.findOne({username: username.toLowerCase()});

		const emailValidate = await User.findOne({email: req.body.email});
	
		if(user) {
			return done(null, false, req.flash('errorMessage', 'El usuario ya existe'));

		} else {

			if(emailValidate){
				return done(null, false, req.flash('errorMessage', 'El email ya existe'));

			} else {
				const newUser = new User();
				newUser.username = username.toLowerCase();
				newUser.password = newUser.encryptPassword(password);
				newUser.email = req.body.email;
				newUser.profileImg = '/img/default-profile-img.jpg',
				newUser.googleId = null;
				newUser.resetPasswordToken = null;
				newUser.resetPasswordExpires = null;
				await newUser.save();
				done(null, newUser);		
			}

		}

}));

//Iniciar sesión

passport.use('local-signin', new LocalStrategy({
	usernamefield: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {

	const user = await User.findOne({username: username.toLowerCase()});
	if(!user) {
		let errorMessage = `Usuario no encontrado`
		return done(null, false, req.flash('errorMessage', errorMessage));
	}

	if(!user.comparePassword(password)) {
		let errorMessage = `Contraseña incorrecta`;
		return done(null, false, req.flash('errorMessage', errorMessage));
	}

	done(null, user);
}));

