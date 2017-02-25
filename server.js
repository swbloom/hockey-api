const express		= require('express');
const app			= express();
const bodyParser	= require('body-parser');
const mongoose		= require('mongoose');
const Team			= require('./models/team');

mongoose.connect('mongodb://localhost/hockey');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.PORT || 8080;

const router = express.Router();

router.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
   	res.header('Access-Control-Allow-Credentials', true);
 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-length, Accept, x-access-token');
 	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	next();
});

router.route('/teams')
	.post((req, res) => {
		const team = new Team();

		team.name = req.body.name;

		team.save((err) => {
			err && res.send(err);

			res.json({ message: 'Team added!'});
		});
	})
	.get((req, res) => {
		Team.find((err, teams) => {
			if (err) res.send(err);

			res.json(teams);
	});
});

router.route('/teams/:team_id')
	.get((req,res) => {
		Team.findById(req.params.team_id, (err, team) => {
			if (err) res.send(err);

			res.json(team);
		});
	})
	.put((req,res) => {
		Team.findById(req.params.team_id, (err, team) => {
			if (err) res.send(err);

			team.name = req.body.name;

			team.save((err) => {
				if (err) res.send(err);

				res.json({message: 'Team name updated!'});
			});
		});
	})
	.delete((req, res) => {
		Team.remove({
			_id: req.params.team_id
		}, (err, team) => {
			if (err) res.send(err);

			res.json({message: 'Successfully deleted'});
		})
	});


router.get('/', (req, res) => {
	res.json({message: 'Success'});
});

app.use('/api', router);

app.listen(port);
console.log(`Listening on ${port}`);