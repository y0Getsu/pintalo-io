//Vamos a utilizar los schemas
const mongoose = require('mongoose');
const { Schema } = mongoose;


const ChatSchema = new Schema({
	username: String,
	message: String,
	msgcolor: String,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('chats', ChatSchema);
