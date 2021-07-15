const router = require('express').Router();
const { RSA_NO_PADDING } = require('constants');
const { Post, User } = require('../../models');

// get all users
router.get('/', (req, res) => {
	Post.findAll({
		attributes: ['id', 'post_url', 'title', 'created_at'],
		include: [
			{
				model: User,
				attributes: ['username']
			}
		]

	})
		.then(dbPostData => res.json(dbPostData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});
// get one user
router.get('/:id', (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id
		},
		attributes: ['id', 'post_url', 'title', 'created_at'],
		include: [
			{
				model: User,
				attributes: ['username']
			}
		]
	})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: "no post found with this ID" });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});
// create post
router.post('/', (req, res) => {
	// expects {title: 'Everyone wants to go to Hawaii!', post_url: 'https://hawaiitravel.com', user_id: 1}
	Post.create({
		title: req.body.title,
		post_url: req.body.post_url,
		user_id: req.body.user_id
	})
		.then(dbPostData => res.json(dbPostData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// update post
router.put('/:id', (req, res) => {
	Post.update(
		{
			title: req.body.title
		},
		{
			where: {
				id: req.params.id
			}
		})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this ID' });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.delete('/:id', (req, res) => {
	Post.destroy({
		where: {
			id: req.params.id
		}
	})
		.then(dbPostData => {
			if (!dbPostData) {
				res.status(404).json({ message: 'No post found with this ID' });
				return;
			}
			res.json(dbPostData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		})
})

module.exports = router;