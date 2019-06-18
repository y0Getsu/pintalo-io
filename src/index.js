//Requerir los modulos dependencias
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const passportGoogle = require('./passport/google-auth');
const http = require('http');
const socketio = require('socket.io');
const port = process.env.PORT || 3000;


// Initializations
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

require('./database');
require('./passport/local-auth');
require('./sockets')(io);

//settings

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.set('port', process.env.port || 3000);
app.use(express.static(__dirname + '/public'));

//middlewares (antes de routes para poder usarlo bien)
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); //{extended: false}: quiere decir que no voy a recibir archivos pesados como imagenes etc, sino que voy a recibir un formulario
app.use(session({
	secret: "mysecretsession",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	app.locals.errorMessage = req.flash('errorMessage');
	app.locals.successMessage = req.flash('successMessage');
	app.locals.infoMessage = req.flash('infoMessage');
	app.locals.user = req.user;
	next();
});

//Routes
app.use('/', require('./routes/index'));

//starting server


server.listen(port, function(){
  console.log('localhost at port', app.get('port'));
});