const mongoose		= require('mongoose');
const Schema		= mongoose.Schema;

const playerSchema	= new Schema({
	name	: String,
	number  : Number,
	_team	: {
				type: Schema.Types.ObjectId,
				ref: 'Team'
			}
});

module.exports = mongoose.model('Player', playerSchema);