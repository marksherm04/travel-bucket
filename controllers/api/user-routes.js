const router = require('express').Router();
const { User, Post, Love, Comment } = require('../../models');

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
			// Post Model
			{
				model: Post,
				attributes: ['id', 'title', 'post_url', 'created_at']
			},
			// Comment Model
			{
				model: Comment,
				attributes: ['id', 'comment_text', 'created_at'],
				include: {
					model: Post,
					attributes: ['title']
				}
			},
			// Post Model through Loved Posts
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
		.then(dbUserData => {
			req.session.save(() => {
				req.session.user_id = dbUserData.id;
				req.session.username = dbUserData.username;
				req.session.loggedIn = true;

				res.json(dbUserData);
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});
// login route
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

			req.session.save(() => {
				// session variables
				req.session.user_id = dbUserData.id;
				req.session.username = dbUserData.username;
				req.session.loggedIn = true;

				res.json({ user: dbUserData, message: 'You are logged in.' });
			});
		});
});

// logout route
router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
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