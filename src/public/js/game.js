const socket = io();

const $message = $('#message');
const $form = $('#myform');
const $enviar = $('#enviar');
const $chat = $('#chat');
const $users = $('#users');
const $word = $('#ventana');
const $divOfCanvas = $('#div2');

$form.submit( e => {

	e.preventDefault();
	console.log('has entrado');

	if($message.val().trim() === ''){
		return false;

	} else {
		socket.emit('new message', $message.val());
		//socket.emit('guessWord', $message.val());
		$message.val('');

	}

});

socket.on('loadOld', function(data) {

	console.log('recopilando mensajes...');
	for(let i = data.length - 1; i >= 0; --i){
		$chat.append(`<div><b> ${data[i].username} :</b> ${data[i].message}</div>`);			
	}
	

});

socket.on('chat events', (data) => {
	$chat.append(data);
	$chat.animate({ scrollTop: $chat.prop('scrollHeight')}, 0);
});

socket.on('user connected', data => {
	$chat.append(`<div><i> ${data} :</i></div>`);
	$chat.animate({ scrollTop: $chat.prop('scrollHeight')}, 0);		
});

socket.on('user disconnect', data => {
	$chat.append(`<div><i> ${data} :</i></div>`);	
	$chat.animate({ scrollTop: $chat.prop('scrollHeight')}, 0);	
});

socket.on('isDrawer', data => {
	$chat.append(`<div><i> ${data} :</i></div>`);	
	$chat.animate({ scrollTop: $chat.prop('scrollHeight')}, 0);
});

socket.on('send message', function(data) {
	$chat.append(`<div class="userMessage"><b style="color: ${data.msgcolor}"> ${data.username} :</b> ${data.message}</div>`);
	$chat.animate({ scrollTop: $chat.prop('scrollHeight')}, 0);
});

socket.on('listUsers', function(data) {
	let html = '';

	for(let i = 0; i < data.length; i++){
		html += `<div><img src=${data[i].profileImg} class="profileImg" style='border: 2px solid ${data[i].colorUser}'></img><span style='color: ${data[i].colorUser}'> ${data[i].username}</span><div>${data[i].score}<img src='/img/coin.png' class='coin'></img></div></div>`;		
	}

/*
	for(user in listUsers){
		html += `<div><img src='/img/default-profile-img.jpg' width='50px' height='50px'></img><span> ${listUsers[user]} </span>`;
	}
*/
	$users.html(html);
});

socket.on('theDrawer', (data)=> {
	$('.drawer').html(`${data} <img src='/img/drawer.png' width='25px' height='25px'></img>`);
});

socket.on('pole', (data)=> {
	$('.pole').html(data);
});

var canvasdiv = document.getElementById('div2');
var pencil = true;
var typePincel = 'pincel';

function setup() {

   	sketchCanvas = createCanvas(500,500);
  	background(255, 255, 255);

  	socket.on('send drawing', drawDrawer);
  	socket.on('game', drawerOrNot);
  	socket.on('divDrawer', divDrawer);
  	socket.on('divGuesser', divGuesser);
  	socket.on('clearCanvas', clearCanvas);
  	socket.on('sounds', sounds);
  	socket.on('userAlreadyExists', userAlreadyExists);
  	socket.on('loadDraw', loadDraw);
  	
}

function loadDraw(data) {
	for(let i = 0; i < data.length; i++) {
		stroke(data[i].strokeColor);
		strokeWeight(data[i].strokeSize);

		line(data[i].mosX, data[i].mosY, data[i].lastMosX, data[i].lastMosY);
		console.log('Enviado a cliente_: ' + data[i].strokeColor);	
	}	

}

function divDrawer(data) {
	$('.word').html(data.toUpperCase());

}

function divGuesser(data) {
	$('.word').html(data.toUpperCase());

}


socket.on('timeToGuess', (data) => {
	$('.time').html(data);

});

socket.on('showWordToGuess', (data) => {

	setTimeout( () => {
		$('.gameEvents').html(data.toUpperCase()).show().css('animation-play-state', 'running');
		setTimeout( () => {
			$('.gameEvents').html(data).hide();
		}, 4000);

	}, 4000)

});

function clearCanvas(){
	sketchCanvas = noCanvas();
	sketchCanvas = createCanvas(500, 500);
	background(255, 255, 255);
	canvasResponsive();

};

function drawDrawer(data) {

	stroke(data.strokeColor);
	strokeWeight(data.strokeSize);

	line(data.mosX, data.mosY, data.lastMosX, data.lastMosY);	
}

var drawerOrNot = function (data) {
	if(data == 'drawer') {
		click = true;
		pencil = true;
		$('.palette').css('visibility', 'visible');
		cursor('/img/pencil-cursor.cur');


	} else {
		click = false;
		pencil = false;
		$('.palette').css('visibility', 'hidden');
		cursor(ARROW);
	}

	return click;

}

function pincelOrErased() {
	typePencil = pencil == true ?  'pincel' : 'erased'; 
	return typePencil;

}

function getColor(){
	var colors = $(".colors").spectrum('get').toRgbString();
	return colors;  

}

function getStrokeSize() {
	let strokeSize = $('#strokeSize').val();
	return strokeSize;

}

function mouseDragged() {
	if(click) {
		if(pincelOrErased() == 'pincel') {
			
			var drawing = {
				mosX: mouseX,
				mosY: mouseY,
				lastMosX: pmouseX,
				lastMosY: pmouseY,
				strokeColor: getColor(),
				strokeSize: getStrokeSize()
			}				

			socket.emit('drawing', drawing);

		} else {
			var erased = {
				mosX: mouseX,
				mosY: mouseY,
				lastMosX: pmouseX,
				lastMosY: pmouseY,
				strokeColor: 'rgb(255, 255, 255)',
				strokeSize: getStrokeSize()		
			}				

			socket.emit('drawing', erased);

		}
	}
			
}			

canvas = document.getElementsByTagName('canvas');

window.addEventListener("resize", function(e){	
	canvasResponsive();

});

window.addEventListener("load", function(e){
	canvasResponsive();

});

function canvasResponsive() {
	console.log('Anchura :' + window.innerWidth);
	console.log('Altura :' + window.innerHeight);

	console.log('ANCHURA DIV2: ' + $('#div2').width().toString() + 'px');
	console.log('ALTO DIV2: ' + $('#div2').height().toString() + 'px');

	canvas.style.width = $('#div2').width().toString() + 'px';
	canvas.style.height = $('#div2').height().toString() + 'px';
	sketchCanvas.parent("div2");		
}

$('.erased').click(function () {
	pencil = false;
	cursor('/img/eraser-cursor2.png');
});

$('.pencil').click(function () {
	pencil = true;
	cursor('/img/pencil-cursor.cur');
});

$('.palette, .pencil, .erased, #strokeSize').mouseenter(function() {
	click = false;
});

$('.palette, .pencil, .erased, #strokeSize').mouseleave(function() {
	click = true;
});



function sounds(data) {
	if(data == 'countdown'){
		countdown = new Audio('/sounds/countdown.ogg');
		countdown.play();	

	} else if(data == 'start') {
		start = new Audio('/sounds/start.wav');
		start.play();	

	} else if(data == 'end'){
		end = new Audio('/sounds/end.wav');
		end.play();	

	} else {
		correctAnswer = new Audio('/sounds/correctAnswer2.wav');
		correctAnswer.play();		
	}

}

function userAlreadyExists() {
	$('.content').append(`<div class='userAlreadyExists'> No puedes jugar dos partidas al mismo tiempo\n</div>`)
}


