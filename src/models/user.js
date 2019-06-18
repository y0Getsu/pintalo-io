const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

//Declaramos los datos del Schema
const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	profileImg: String,
	googleId: String,	
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.methods.encryptPassword = (password) =>{ 
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //encriptamos con hasSync, y con genSaltSync las veces que va a ejecutar el algoritmo
}

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
}

//users: nombre de la coleccion y exportamos para poder usarlo en la app
module.exports = mongoose.model('users', userSchema);
