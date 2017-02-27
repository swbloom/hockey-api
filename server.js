const express		= require('express');
const app			= express();
const bodyParser	= require('body-parser');
const mongoose		= require('mongoose');
const Conference 	= require('./models/conference');
const Division 		= require('./models/division');
const Team			= require('./models/team');
const Player 		= require('./models/player');


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

router.route('/conferences')
	.post((req, res) => {
		const conference = new Conference();

		conference.name = req.body.name;

		conference.save((err, doc) => {
			err && res.send(err);
			res.json({ doc });
		});
	})
	.get((req, res) => {
		Conference.find((err, conferences) => {
			if (err) res.send(err);

			res.json(conferences);
		}).populate('divisions');
	});

router.route('/divisions')
	.post((req, res) => {
		const division = new Division();

		division.name = req.body.name;

		division.save((err, doc) => {
			err && res.send(err);
			res.json({ doc});
		});
	})
	.get((req, res) => {
		Division.find((err, divisions) => {
			if (err) res.send(err);

			res.json(divisions);
		}).populate('teams');
	});

router.route('/players')
	.post((req, res) => {
		const player = new Player();

		player.name = req.body.name;
		player._team = req.body._team;

		player.save((err, doc) => {
			err && res.send(err);
			res.json({ doc });
		});
	})
	.get((req, res) => {
		Player.find((err, players) => {
			if (err) res.send(err);

			res.json(players);
		}).populate('_team', 'name');
	});

router.route('/teams')
	.post((req, res) => {
		const team = new Team();

		team.name = req.body.name;
		team.city = req.body.city;
		team.arena = req.body.arena;
		team.conference = mongoose.Types.ObjectId(req.body.conference);
		team.division = mongoose.Types.ObjectId(req.body.division);

		team.save((err, doc) => {
			if (err) res.send(err);

			res.json({ doc });
		});

		Division.findById(team.division, (err, division) => {
			if (err) res.send(err);
			division.teams = [...division.teams, team._id];
			division.save((err, doc) => {
				err && res.send(err);
			});
		});
	})
	.get((req, res) => {
		Team.find((err, teams) => {
			if (err) res.send(err);

			res.json(teams);
	}).populate('players');
});

router.route('/players/:player_id') 
	.get((req,res) => {
		Player.findById(req.params.player_id, (err, team) => {
			if (err) res.send(err);

			res.json(team);
		}).populate('_team', 'name');
	});

router.route('/teams/:team_id')
	.get((req,res) => {
		Team.findById(req.params.team_id, (err, team) => {
			if (err) res.send(err);

			res.json(team);
		}).populate('players');
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