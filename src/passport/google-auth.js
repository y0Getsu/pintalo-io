const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../keys');
const User = require('../models/user.js');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

passport.use(
	new GoogleStrategy( {
		//options of google
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret		
	}, (accessToken, refreshToken, profile, done) => {
		//callback function
		console.log(profile);
		User.findOne({email: profile._json.email}).then((isUser) => {
			if(isUser){
				//This user has registered before
				console.log('user is: ' + isUser);
				done(null, isUser);

			} else {
				//If not, create a new user
				new User({
					username: profile.displayName.toLowerCase(),
					email: profile._json.email,
					password: null,
					profileImg: profile._json.picture,
					googleId: profile.id,
					resetPasswordToken: null,
					resetPasswordExpires: null

				}).save().then((newUser) => {
					console.log('new user created' + newUser);
					done(null, newUser);
				});

			}

		});
	})
)





