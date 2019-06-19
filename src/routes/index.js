const express = require('express');
const router = express.Router(); // para poder definir las rutas de nuestro proyecto
const passport = require('passport');
const User = require('../models/user');

//Controllers

var pageController = require('../controllers/pageController');
var usernameController = require('../controllers/usernameController');
var emailController = require('../controllers/emailController');
var passwordController = require('../controllers/passwordController');
var forgotPasswordController = require('../controllers/forgotPasswordController');
var resetPasswordController = require('../controllers/resetPasswordController');
var gameController = require('../controllers/gameController');

//Middlewares

var isLoggedIn = require('../middlewares/checkAuth').isLoggedIn;
var isNotLoggedIn = require('../middlewares/checkAuth').isNotLoggedIn;

//signin routes

router.get('/', isNotLoggedIn, pageController.first_page_get);

router.post('/',isNotLoggedIn, passport.authenticate('local-signin', {
	successRedirect: '/lobby',
	failureRedirect: '/',
	passReqToCallBack: true
}));

//signup routes

router.get('/signup',isNotLoggedIn,pageController.signup_page_get);

router.post('/signup',isNotLoggedIn, passport.authenticate('local-signup', {
	successRedirect: '/lobby',
	failureRedirect: '/signup',
	passReqToCallBack: true
}));

//sign google routes

router.get('/auth/google',passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/auth/google/redirect',isNotLoggedIn, passport.authenticate('google'), function(req, res){
	res.redirect('/lobby');
});

//forgot password routes

router.get('/forgot-password', isNotLoggedIn, forgotPasswordController.forgotpassword_get);

router.post('/forgot-password', isNotLoggedIn, forgotPasswordController.forgotpassword_post);

//reset password routes

router.get('/reset-password/:token', isNotLoggedIn, resetPasswordController.resetpassword_get);

router.post('/reset-password/:token', isNotLoggedIn, resetPasswordController.resetpassword_post);

//lobby routes

router.get('/lobby',isLoggedIn, pageController.lobby_page_get);

//profile routes

router.get('/profile/:username', isLoggedIn, pageController.profile_page_get);

router.get('/profile/:username/show-profile', isLoggedIn, pageController.showprofile_page_get);

router.get('/profile/:username/edit', isLoggedIn, pageController.edit_page_get);

router.get('/profile/:username/edit/edit-name',isLoggedIn, usernameController.edit_user_get);

router.post('/profile/:username/edit/edit-name', isLoggedIn, usernameController.edit_user_post);

router.get('/profile/:username/edit/edit-email',isLoggedIn, emailController.edit_email_get);

router.post('/profile/:username/edit/edit-email',isLoggedIn, emailController.edit_email_post);

router.get('/profile/:username/edit/edit-password',isLoggedIn, passwordController.reset_password_get);

router.post('/profile/:username/edit/edit-password', isLoggedIn, passwordController.reset_password_post);

//manual routes

router.get('/manual', isLoggedIn, pageController.manual_page_get);

//logout routes

router.get('/logout',isLoggedIn, pageController.logout_get);

//game routes
router.get('/game', isLoggedIn, gameController.game_get);

//admin panel routes

router.get('/administration-panel', isLoggedIn, pageController.administration_page_get);

//export router

module.exports = router;

