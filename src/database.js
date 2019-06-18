const mongoose = require('mongoose');
const {mongodb} = require('./keys');

//Conectamos la base de datosdsfsdf
mongoose.connect(mongodb.URIHEROKU, {useNewUrlParser: true})
	.then(db => console.log(`Database is connected                                                                                                                     
 ######   ###  ###  ##  ########  #######  ###     #######      ###  ####### 
 #    ##  ###  #### ##     ###    #    ##  ###     ##   ##      ###  ##   ##
 ######   ###  #######     ###    #######  ###     ##   ##      ###  ##   ##
 ###      ###  ### ###     ###    ###  ##  ###     ##   ##  ##  ###  ##   ##
 ###      ###  ###  ##     ###    ###  ##  #######  #####   ##  ###   #####  `))
	.catch(err => console.error(err));