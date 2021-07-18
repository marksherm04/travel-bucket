const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Love, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all Posts
router.get('/', (req, res) => {
	Post.findAll({
		order: [['created_at', 'DESC']],
		attributes: [
			'id',
			'post_url',
			'title',
			'created_at',
			[sequelize.literal('(SELECT COUNT(*) FROM love WHERE post.id = love.post_id)'), 'love_count']
		],
		include: [
			// Comment model
			{
				model: Comment,
				attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
				include: {
					model: User,
					attributes: ['username']
				}
			},
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

router.get('/:id', (req, res) => {
	Post.findOne({
	  where: {
	    id: req.params.id
	  },
	  attributes: [
	    'id',
	    'post_url',
	    'title',
	    'created_at',
	    [sequelize.literal('(SELECT COUNT(*) FROM love WHERE post.id = love.post_id)'), 'love_count']
	  ],
	  include: [
	    {
	      model: Comment,
	      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
	      include: {
		model: User,
		attributes: ['username']
	      }
	    },
	    {
	      model: User,
	      attributes: ['username']
	    }
	  ]
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

// create Post
router.post('/', withAuth, (req, res) => {
	// expects {title: 'Everyone wants to go to Hawaii!', post_url: 'https://hawaiitravel.com', user_id: 1}
	Post.create({
		title: req.body.title,
		post_url: req.body.post_url,
		user_id: req.session.user_id
	})
		.then(dbPostData => res.json(dbPostData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// PUT /api/posts/lovedpost
router.put('/upvote', withAuth, (req, res) => {
	// see if session exists
	if (req.session) {
		// pass along session id with all broken down properities on req.body
		Post.upvote({ ...req.body, user_id: req.session.user_id }, { Love, Comment, User })
			.then(updatedPostData => res.json(updatedPostData))
			.catch(err => {
				console.log(err);
				res.status(500).json(err);
			});
	}
});


// update post
router.put('/:id', withAuth, (req, res) => {
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

router.delete('/:id', withAuth, (req, res) => {
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
		});
});

module.exports = router;