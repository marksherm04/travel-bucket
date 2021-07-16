const router = require('express').Router();
const { User, Post, Love } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
	User.findAll({
		attributes: { exclude: ['password'] }
	})
		.then(dbUserData => res.json(dbUserData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// GET /api/users/1
router.get('/:id', (req, res) => {
	User.findOne({
		attributes: { exclude: ['password'] },
		where: {
			id: req.params.id
		},
		include: [
			{
				model: Post,
				attributes: ['id', 'title', 'post_url', 'created_at']
			},
			{
				model: Post,
				attributes: ['title'],
				through: Love,
				as: 'loved_posts'
			}
		]
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(404).json({ message: "No user found with this ID" });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// POST /api/users
router.post('/', (req, res) => {
	// expects {username: 'mike', email: 'mikes@gmail.com', password: 'password1234'}
	User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})
		.then(dbUserData => res.json(dbUserData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post('/login', (req, res) => {
	// expects {email: 'mikes@gmail.com', password: 'password1234'}
	User.findOne({
		where: {
			email: req.body.email
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(400).json({ message: 'No user with that email address.' });
				return;
			}
			// Verify user
			const correctPassword = dbUserData.checkPassword(req.body.password);
			if (!correctPassword) {
				res.status(400).json({ message: 'Password incorrect!' });
				return;
			}

			res.json({ user: dbUserData, message: 'You are logged in.' });
		});
});

// PUT api/users/1
router.put('/:id', (req, res) => {
	// expects {username: 'mike', email: 'mikes@gmail.com', password: 'password1234'}

	User.update(req.body, {
		individualHooks: true,
		where: {
			id: req.params.id
		}
	})
		.then(dbUserData => {
			if (!dbUserData[0]) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// DELETE api/users/1
router.delete('/:id', (req, res) => {
	User.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(dbUserData => {
			if (!dbUserData) {
				res.status(404).json({ message: 'No user found with this id' });
				return;
			}
			res.json(dbUserData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;