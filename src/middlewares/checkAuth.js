const middlewares = {

	isLoggedIn : function (req, res, next) {
		if(req.isAuthenticated()) {
			if(req.user.username == 'admin'){
				isAdmin = true;
			} else {
				isAdmin = false;
			}
			
			return next();
		}

		res.redirect('/');		
	},

	isNotLoggedIn : function (req, res, next) {
		if(!req.isAuthenticated()) {
			return next();
		}

		res.redirect('/profile/'+req.user.username);	
	}

}

module.exports = middlewares;