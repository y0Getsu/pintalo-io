const User = require('../models/user');

exports.game_get = function(req, res) {
	res.render('game');
	user = req.user;
}