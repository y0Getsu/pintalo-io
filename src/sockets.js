const User = require('./models/user');
const Chat = require('./models/chat');

module.exports = function(io){
	let numberRoom = 0;
	let totalUsers = ['null'];
	let numberPosition = 0;
	let roomsGame = [{
		roomName: 'Sala ' + numberRoom.toString(),
		players: 0,
		rounds: 1,
		wordGuess: null,
		correctWords: 0,
		guessersCorrectWords: false,
		game: false,
		listUsers: [],
		drawer: false,
		seconds: 60,
		playerDrawer: [],
		draws: []
	}];

	var words = [
	    "Pulso", "Supermercado", "Mama", "Abecedario", "ladron", "Gemelo", "Minino",
	    "Intendente", "Alarma", "Princesa", "Jinete", "hombre", "mujer", "casa", "niña", "chico",
	    "chica", "asesino", "tren", "monitor", "mes", "portatil", "movil", "muro", "italia",
	    "isla", "mar", "mano", "color", "extintor", "pared", "naranja", "limon",
	    "perro", "gorila", "mono", "lechuza", "colibri", "pais", "idea",
	    "gato", "escuela", "carrera", "comida", "divertido", "gracioso", "saltar", "hablar", "teclear",
	    "auriculares", "pelicla", "cone", "noche", "cazadora", "reirse", "grande", "pequeño", "tierra",
	    "jupiter", "rebelde", "mesa", "silla", "pizarra", "musica", "rio", "coche",
	    "caja", "lampara", "superheroe", "loco", "enfermo", "programa", "television", "tablet",
	    "montaña", "caballo", "mirar", "color", "cara", "arbol", "lista", "pajaro",
	    "cuerpo", "alto", "familia", "sonido", "puerta", "bosque", "cucaracha", "Investigador", "Manzana",
	    "roca", "Capitan", "fuego", "problema", "avion", "arriba", "abajo", "rey",
	    "espacio", "volante", "unicornio", "duende", "armario", "sol", "timador", "tractor", "feather", "prohibido"
	];

	
	io.on('connection', socket => {

		socket.username = user.username;
		socket.color = ramdomMsgColor();
		
		//loadOldMsg();

		//Comprobamos si el usuario ya esta en partida
		/*
		totalUsers.forEach(function(element, index, array) {
			if(element == socket.username){
					console.log('El usuario ya esta en partida');
					socket.emit('userAlreadyExists');
					io.sockets.sockets[socket.id].disconnect();

			}
		});
		*/		
		//CREANDO SALAS DINÁMICAS
		for(let i = 0; i < roomsGame.length; i++) {
			var sala = roomsGame[i];

			if(sala.players < 5) {
				socket.join(sala.roomName); // Entra a la sala
				sala.players += 1; // sumamos un jugador

				if(sala.drawer == false){ //Si no hay pintador, lo asignamos 
					sala.listUsers.push({id: socket.id, username: user.username, profileImg: user.profileImg, score: 0, guessWord: true, colorUser: socket.color, playerType: 'drawer'});
					totalUsers.push(socket.username);
					sala.drawer = true;
					io.to(sala.roomName).emit('listUsers', sala.listUsers);
					io.to(sala.roomName).emit('user connected', `El usuario <b style='color: ${socket.color}'> ${user.username} </b> ha entrado a la ${sala.roomName}`);
					sala.playerDrawer.push({drawer: user.username, id: socket.id});
					socket.emit('game', 'guesser');
					socket.emit('timeToGuess', 'ESPERANDO JUGADORES');
					console.log('Usuario unido a la sala como DRAWER');
					console.log(JSON.stringify(roomsGame, null, '	'));

				} else {
					sala.listUsers.push({id: socket.id, username: user.username, profileImg: user.profileImg, score: 0, guessWord: false, colorUser: socket.color, playerType: 'guesser'});
					totalUsers.push(socket.username);
					io.to(sala.roomName).emit('listUsers', sala.listUsers);
					io.to(sala.roomName).emit('user connected', `El usuario <b style='color: ${socket.color}'> ${user.username} </b> ha entrado a la ${sala.roomName}`);
					socket.emit('game', 'guesser');
					socket.emit('timeToGuess', 'ESPERANDO JUGADORES');
					console.log('Usuario unido a la sala como GUESSER');
					console.log(JSON.stringify(roomsGame, null, '	'));

				}

				if(sala.players == 3 && sala.game == false){
					//El juego empieza :)
					sala.game = true;
					gameStarts(sala);
					console.log('El juego va a comenzar..');

				}

				if(sala.game == true) {
					console.log('HA ENTRADO EN PARTIDA EMPEZADA');
					wordForDrawerAndGuesser(sala, salaDrawer);
					io.to(sala.roomName).emit('theDrawer', sala.playerDrawer[0].drawer);
					loadDraw(sala.roomName);

				}
				
				console.log('Nº de jugadores en la ' + sala.roomName + ' --> ' + sala.players + '\n-------------------');
				break;

			} else if(sala.players == 5 && i == (roomsGame.length - 1)) { 
				//Si los jugadores son 3 y es la última sala creada --> Se creará una nueva sala
				numberRoom++;

				roomsGame.push({
					roomName: 'Sala ' + numberRoom,
					players: 1,
					rounds: 1,
					wordGuess: null,
					correctWords: 0,
					guessersCorrectWords: 0,
					game: false,
					listUsers: [{id: socket.id, username: user.username, profileImg: user.profileImg, score: 0, guessWord: true, colorUser: socket.color, playerType: 'drawer'}],
					drawer: true,
					seconds: 60,
					playerDrawer: [{drawer: user.username, id: socket.id}],
					draws: []
				});

				socket.join(roomsGame[roomsGame.length - 1].roomName);
				totalUsers.push(socket.username);
				io.to(roomsGame[roomsGame.length - 1].roomName).emit('listUsers', roomsGame[roomsGame.length - 1].listUsers);
				io.to(roomsGame[roomsGame.length - 1].roomName).emit('user connected', 'El usuario <b>' + user.username + '</b> ha entrado a la ' + roomsGame[roomsGame.length - 1].roomName);
				socket.emit('timeToGuess', 'ESPERANDO JUGADORES');
				//socket.emit('game', 'drawer');
				console.log('Nueva sala creada');
				console.log('Usuario unido a la sala como DRAWER');
				console.log('Nº de jugadores en la ' + roomsGame[roomsGame.length - 1].roomName + ': ' + roomsGame[roomsGame.length - 1].players + '\n-------------------');
				
				break;
			}	
		}

		socket.on('new message', function(message) { //recogemos el mensaje y lo enviamos a todos los clientes
			console.log('El usuario ' + socket.username + ' ha enviado el siguiente mensaje: '  + message);

			var msg = new Chat({ //Guardamos en la base de datos de mongodb
				username: socket.username,
				message: message,
				msgcolor: socket.color
			}).save().then(msg => {

				var ownId= socket.id;
				for(let i = 0; i < roomsGame.length; i++) {

					for(let y = 0; y < roomsGame[i].listUsers.length; y++) {
						if(roomsGame[i].listUsers[y].id == socket.id) {

							if(roomsGame[i].wordGuess == msg.message.toLowerCase() && roomsGame[i].listUsers[y].guessWord == false){
								io.to(sala.roomName).emit('sounds', 'correctAnswer')
								roomsGame[i].correctWords += 1;
								roomsGame[i].listUsers[y].score += getScore(roomsGame[i]);
								roomsGame[i].listUsers[y].guessWord = true;
								io.to(sala.roomName).emit('listUsers', roomsGame[i].listUsers);
								io.to(roomsGame[i].roomName).emit('chat events', `<div style='color: #111111;'>El jugador <b style='color: ${socket.color}'>${socket.username}</b> ha acertado!</div>` );
								console.log('El jugador: ' + roomsGame[i].listUsers[y].username + ' ha acertado, BIEN JUGADO!');
							}
							else if(roomsGame[i].wordGuess == msg.message.toLowerCase() && roomsGame[i].listUsers[y].guessWord == true) {
								
							}
							 else {
							 	io.to(roomsGame[i].roomName).emit('send message', msg);
							 }

						}
					}	
				}
				console.log('Mensaje guardado con éxito y contiene las siguientes propiedades: ' + msg);

				
			});
			

		});

		socket.on('drawing', function(data) {
			console.log('drawing: ' + JSON.stringify(data));

			for(let i = 0; i < roomsGame.length; i++) {

				for(let y = 0; y < roomsGame[i].listUsers.length; y++) {
					if(roomsGame[i].listUsers[y].id == socket.id) {

						io.to(roomsGame[i].roomName).emit('send drawing', data);
						
						//Guardamos el dibujo en la db para poder cargar el dibujo a nuevos participantes
						roomsGame[i].draws.push({
							mosX: data.mosX,
							mosY: data.mosY,
							lastMosX: data.lastMosX,
							lastMosY: data.lastMosY,
							strokeSize: data.strokeSize,
							strokeColor: data.strokeColor
						});
					}
				}	
			}

		});

		socket.on('disconnect', () => {
			//Borrando jugador desconectado de la sala
			console.log(JSON.stringify(roomsGame, null, '	'));
			console.log('Id del jugador a eliminar: ' + socket.id);
			deletePlayer = socket.id;

			for(let i = 0; i < roomsGame.length; i++) {
				var sala = roomsGame[i];

				for(let y = 0; y < sala.listUsers.length; y++) {
					if(sala.listUsers[y].id == deletePlayer) {
						console.log('Borrando Jugador...');
						/*
						totalUsers.forEach(function(element, index, array) {
							if(element == socket.username){
								totalUsers.splice(index, 1);
							}
						});
						*/
						if(sala.listUsers[y].playerType == 'drawer') {
							//borramos primero el jugador
							sala.listUsers.splice(y, 1);
							sala.players -= 1;
							sala.playerDrawer.splice(0, 1, {drawer: null, id: null});
							io.to(roomsGame[i].roomName).emit('listUsers', roomsGame[i].listUsers);
							io.to(roomsGame[i].roomName).emit('user disconnect', 'El usuario <b>' + user.username + '</b> se ha desconectado de la ' + sala.roomName);
							if(sala.players > 1){
								drawerDiscSoNewRound(sala);
							}
							else { 
								stopGame(sala); 
							}
							

						} else {
							//Si no es drawer simplemente lo borramos
							sala.listUsers.splice(y, 1);
							sala.players -= 1;		
							io.to(roomsGame[i].roomName).emit('listUsers', roomsGame[i].listUsers);
							io.to(roomsGame[i].roomName).emit('user disconnect', 'El usuario <b>' + user.username + '</b> se ha desconectado de la ' + sala.roomName);
						}

						if(sala.players == 0 && i == 0){
							//clearTimeout(gameStart);
							roomsGame.splice(i, 1, {
								roomName: 'Sala ' + 0,
								players: 0,
								rounds: 1,
								wordGuess: null,
								correctWords: 0,
								guessersCorrectWords: false,
								game: false,
								listUsers: [],
								drawer: false,
								seconds: 60,
								playerDrawer: [],
								draws: []
						});
							console.log('No quedan jugadores en la sala 0');
							console.log('Procediendo a resetear sala 0');
							stopGame(sala);

						} else if(sala.players == 0 && i != 0) {
							roomsGame.splice(i, 1);
							console.log(roomsGame);
							console.log('No quedan jugadores en la sala');
							console.log('Sala borrada');
						}

						break;

					} else {
						console.log('No encontrado');
					}					
				}
			}

			console.log(JSON.stringify(roomsGame, null, '	'));

		});

		function stopGame(sala) {
			io.to(sala.roomName).emit('divDrawer', '');	
			io.to(sala.roomName).emit('divGuesser', '');	
			io.to(sala.roomName).emit('timeToGuess', 'ESPERANDO JUGADORES');

			if(sala.players == 1) {
				sala.rounds = 1;
				sala.wordGuess = null;
				sala.correctWords = 0;
				sala.guessersCorrectWords = 0;
				sala.game = false;
				sala.drawer = true;
				sala.seconds = 60;
				newDrawer = Math.floor(Math.random() * sala.listUsers.length);
				sala.listUsers[newDrawer].playerType = 'drawer'; //lo convertimos en drawer
				sala.playerDrawer.splice(0, 1, {drawer: sala.listUsers[newDrawer].username, id: sala.listUsers[newDrawer].id});
				sala.draws = [];
				socket.emit('chat events', 'Lo sentimos pero no ha suficientes jugadores en la sala, el juego se reiniciará cuando haya nuevos jugadores');

			}	
		}

		function ramdomMsgColor() {
			let color = ['#0074D9', '#7FDBFF', '#39CCCC', '#01FF70', '#FFDC00', '#FF4136',
			'#85144b', '#F012BE', '#B10DC9'];

			return randomColor = color[Math.floor(Math.random() * color.length)];
		}

		function loadOldMsg() {
			Chat.find({}).sort({created_at: -1}).limit(6).then(message => { //Función para mostrar los 6 últimos mensajes
				console.log(message);
				socket.emit('loadOld', message);

			});	
		}

		function loadDraw(roomDraw) {
			for(let i = 0; i < roomsGame.length; i++){
				if(roomsGame[i].roomName == roomDraw) {
					socket.emit('loadDraw', roomsGame[i].draws);
				}
			}

		}

		function newWord() {
			wordcount = Math.floor(Math.random() * (words.length));
			return words[wordcount];
		};

		function getScore(sala) {
			numberPosition++;
			let secondsScore = sala.seconds / 100;

			switch(numberPosition){
				case 1: 
					calcScore = (334 * secondsScore) / 1;
					return parseInt(calcScore);

				case 2: 
					calcScore = (334 * secondsScore) / 1.1;
					return parseInt(calcScore);

				case 3: 
					calcScore = (334 * secondsScore) / 1.2;
					return parseInt(calcScore);

				case 4: 
					calcScore = (334 * secondsScore) / 1.3;
					return parseInt(calcScore);

				case 5: 
					calcScore = (334 * secondsScore) / 1.4;
					return parseInt(calcScore);		
			}

		}

		function newRound(sala, lastDrawer) {
			
			sala.rounds += 1;
			sala.seconds = 60;
			numberPosition = 0;
			sala.correctWords = 0;
			sala.guessersCorrectWords = false;	
			sala.draws = [];		

			if(sala.rounds <= 6) { bestScore(sala) };

			io.to(sala.roomName).emit('clearCanvas');
			
			for(let y = 0; y < sala.listUsers.length; y++) {
				if (sala.listUsers[y].id == lastDrawer) {
					sala.listUsers[y].playerType = 'guesser';
					io.to(lastDrawer).emit('game', 'guesser'); //convertimos al antiguo pintador en adivinador

				}
				sala.listUsers[y].guessWord = false; //aprovechamos para que se pueda volver a sumar el score;
			}

			if(sala.players > 0) {
				newDrawer = Math.floor(Math.random() * sala.listUsers.length);
				sala.listUsers[newDrawer].playerType = 'drawer'; //lo convertimos en drawer
				sala.playerDrawer.splice(0, 1, {drawer: sala.listUsers[newDrawer].username, id: sala.listUsers[newDrawer].id});
				sala.listUsers[newDrawer].guessWord = true;
				lastDrawer = sala.listUsers[newDrawer].id;

				if(sala.rounds <= 6) {
					io.to(sala.roomName).emit('chat events', `<div style='color: green;'><b>¿Preparados para la siguiente ronda? :)</b></div>`);

					gameStart = setTimeout( () => {
						if(sala.players <= 1){
							stopGame(sala);
							
						} else {
							io.to(sala.roomName).emit('timeToGuess', 'VA A EMPEZAR LA RONDA ' + sala.rounds);
							gameStarts(sala);
						}
						
					}, 5000);

				} else {
					RestartGame(sala);

				}

				console.log('El jugador: ' + JSON.stringify(sala.listUsers[newDrawer].username) + ' es el nuevo pintador');				
			}
		}

		function timeToGuess(sala, lastDrawer) {

			var interval = setInterval( () => {

				if(drawerDisconnect(sala, lastDrawer)){
					console.log('el pintador ha salido del setInterval() de TIMETOGUESS');
					clearInterval(interval);

				} else if(sala.seconds == 0 || sala.guessersCorrectWords == true) {
					//enseñamos la palabra
					sala.guessersCorrectWords == false ? io.to(sala.roomName).emit('sounds', 'end') : true;
					io.to(lastDrawer).emit('game', 'guesser');
					count = 0;
					points = '';
					var wordGuess = setInterval( () => {
						io.to(sala.roomName).emit('timeToGuess', 'EL DIBUJO ESCONDIDO ERA' + points);
						points += '.';
						count++;
						count == 4 ? clearInterval(wordGuess) : false;

					}, 1000);

					io.to(sala.roomName).emit('showWordToGuess', sala.wordGuess);

					sala.wordGuess = null;
					clearInterval(interval);

					//reseteamos el juego y sumamos la ronda
					setTimeout( () => {
						newRound(sala, lastDrawer);

					}, 8000);				

				} else{

					checkCorrectAnswers(sala);
					sala.seconds -= 1;
					io.to(sala.roomName).emit('timeToGuess', 'TIEMPO: ' + sala.seconds);
				} 
			
			}, 1000);	
		}	

		function drawerDisconnect(sala, lastDrawer) {
			/*
			if(sala.playerDrawer[0].id != lastDrawer){
				return true;

			} else {

				return false;
			}
			*/
			var checkDrawer = sala.playerDrawer[0].id != lastDrawer ? true : false;

			return checkDrawer;
		}
		
		function drawerDiscSoNewRound(sala) {

			sala.wordGuess = newWord();
			sala.seconds = 60;
			numberPosition = 0;
			sala.correctWords = 0;
			sala.guessersCorrectWords = false;
			sala.draws = [];

			io.to(sala.roomName).emit('isDrawer', 'Procediendo a elegir nuevo pintor');
			if(sala.players > 0){
				for(let y = 0; y < sala.listUsers.length; y++) {
					sala.listUsers[y].guessWord = false; //aprovechamos para que se pueda volver a sumar el score;

				}

				if(sala.playerDrawer[0].id == null && sala.game == true){

					newDrawer = Math.floor(Math.random() * sala.listUsers.length);
					sala.listUsers[newDrawer].playerType = 'drawer'; //lo convertimos en drawer
					sala.playerDrawer.splice(0, 1, {drawer: sala.listUsers[newDrawer].username, id: sala.listUsers[newDrawer].id});
					
					io.to(sala.roomName).emit('chat events', `<div style='color: red;'><b>Una pena que el pintor se haya salido :(</b></div>`);	
					io.to(sala.roomName).emit('timeToGuess', 'REINICIANDO LA RONDA ' + sala.rounds);
					io.to(sala.roomName).emit('clearCanvas');
				}

				gameStart = setTimeout( () => {
					if(sala.players <= 1){
						console.log('JUEGO PARADO LOL');
						stopGame(sala);
						
					} else {
						console.log('juego sigue');
						gameStarts(sala);
					}
					
				}, 5000);		
			}

		}

		function checkCorrectAnswers(sala) {

			if(sala.correctWords == sala.listUsers.length - 1){
				io.to(sala.roomName).emit('chat events', `<div style='color: #FF851B;'><b>!Todos habeis contestado!</b></div>`);
				sala.guessersCorrectWords = true;
			}
		}

		function wordForDrawerAndGuesser(sala, drawerId) {

			var str = [];

			for(let i = 0; i < sala.wordGuess.length; i++){
				str.push(sala.wordGuess.charAt(i));
				console.log(str);
			}

			var chars = 0;

			switch(true){
				case str.length <= 2: 
					chars = 1;
					break;

				case str.length <= 3: 
					chars = 2;
					break;

				case str.length <= 7  :
					chars = 3;
					break;

				case str.length <= 9:
					chars = 4;
					break;

				default:
					chars = 5;
					break;
			}

			var countChars = 0;

			while(chars != countChars){
				hideChar = Math.floor(Math.random() * str.length);

				if(str[hideChar] != '_'){
					str.splice(hideChar, 1, '_');
					countChars++;			
				}
			}

			for(let y = 0; y < sala.listUsers.length; y++) {
				if (sala.listUsers[y].id == drawerId) {
					io.to(drawerId).emit('divDrawer', sala.wordGuess);

				} else {
					io.to(sala.listUsers[y].id).emit('divGuesser', str.join(' '));

				}
			}
			
		}

		function gameStarts(sala) {
			salaDrawer = sala.playerDrawer[0].id;

			sala.wordGuess = newWord(); //Introducimos la palabra a adivinar
			io.to(sala.roomName).emit('chat events', `<div style='color: #FF851B;'><b>La ronda  ${sala.rounds} va a comenzar en 5 segundos</b></div>`);

			let secondsCountdown = 5;
			let interval = setInterval( () => {

				if(drawerDisconnect(sala, salaDrawer)){
					console.log('el pintador ha salido del setInterval de gameStarts()');
					clearInterval(interval);
					stopGame(sala);

				} else if(secondsCountdown > 0) {
					io.to(sala.roomName).emit('sounds', 'countdown'),
					io.to(sala.roomName).emit('timeToGuess', `LA RONDA ${sala.rounds} VA A COMENZAR EN ${secondsCountdown}`)					
				
				} else if(secondsCountdown == 0) {
					clearInterval(interval);
					io.to(sala.roomName).emit('timeToGuess', 'VAMOS');
					io.to(sala.roomName).emit('sounds', 'start');
				}

				secondsCountdown--;
			}, 1000);
			
			wordForDrawerAndGuesser(sala, salaDrawer);
			setTimeout( () => {
				if(drawerDisconnect(sala, salaDrawer)){
					console.log('El pintador ha salido del PRIMER setTimeout de gameStarts()');
					io.to(sala.roomName).emit('isDrawer', `El pintador <b style='color: black'> ${sala.playerDrawer[0].drawer} </b> ha abandonado la sala`);
					
				} else {
					io.to(sala.roomName).emit('isDrawer', 'El usuario <b>' + sala.playerDrawer[0].drawer + '</b> va a pintar');
					io.to(sala.roomName).emit('theDrawer', sala.playerDrawer[0].drawer);
					setTimeout( () => {

						if(drawerDisconnect(sala, salaDrawer)){
							console.log('el pintador ha salido del SEGUNDO setTimeout de gameStarts()');
							stopGame(sala);
							
						} else {
							io.to(salaDrawer).emit('game', 'drawer');
							timeToGuess(sala, salaDrawer);

						}
						
					}, 5000);	
				}
           
			}, 2000);
		}	

		function bestScore(sala) {
			var maxScore = 0;
			var betterPlayer = '';

			for(let y = 0; y < sala.listUsers.length; y++) {
				if(sala.listUsers[y].score > maxScore) {
					maxScore = sala.listUsers[y].score;
					betterPlayer = sala.listUsers[y].username;
				}

			}

			if(sala.rounds == 7){
				io.to(sala.roomName).emit('user connected', '<b>FIN DE LA PARTIDA</b>');
				io.to(sala.roomName).emit('user connected', 'El jugador <b> ' + betterPlayer + ' </b> ha ganado la partida con una puntuacion de ' + maxScore + ' puntos');
			
			} else if(maxScore == 0 && sala.rounds >= 2){

				io.to(sala.roomName).emit('pole', 'retiraos..');
			}

			else if(sala.rounds >= 2) {
				io.to(sala.roomName).emit('pole', `<img src='/img/pole.png' width='23px' height='23px'></img>  ${betterPlayer} `);

			}
		}

		function RestartGame(sala) {

			bestScore(sala);

			for(let y = 0; y < sala.listUsers.length; y++) {
				sala.listUsers[y].score = 0; //aprovechamos para que se pueda volver a sumar el score;
				io.to(sala.roomName).emit('listUsers', sala.listUsers);

			}

			io.to(sala.roomName).emit('pole', '');
			sala.rounds = 1;
			sala.wordGuess = null;
			sala.drawer = false;
			sala.seconds = 60;
			sala.draws = [];

			gameStarts(sala);
		}	
	});
}




