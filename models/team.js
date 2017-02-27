const mongoose		= require('mongoose');
const Schema		= mongoose.Schema;

const TeamSchema	= new Schema({
	name: String,
	city: String,
	arena: String,
	conference: {type: Schema.Types.ObjectId, ref: 'Conference'},
	division: {type: Schema.Types.ObjectId, ref: 'Division'},
	players: [{type: Schema.Types.ObjectId, ref: 'Player'}]
});

module.exports = mongoose.model('Team', TeamSchema);