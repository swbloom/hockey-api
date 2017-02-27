const mongoose		= require('mongoose');
const Schema		= mongoose.Schema;

const ConferenceSchema	= new Schema({
	name: String,
	divisions: [{type: Schema.Types.ObjectId, ref: 'Division'}]
});

module.exports = mongoose.model('Conference', ConferenceSchema);