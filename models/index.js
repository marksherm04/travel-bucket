const User = require('./User');
const Post = require('./Post');
const Love = require('./Love');

// Associations
User.hasMany(Post, {
	foreignKey: 'user_id'
});

Post.belongsTo(User, {
	foreignKey: 'user_id'
});

User.belongsToMany(Post, {
	through: Love,
	as: 'loved_posts',
	foreignKey: 'user_id'
});

Post.belongsToMany(User, {
	through: Love,
	as: 'loved_posts',
	foreignKey: 'post_id'
});

Love.belongsTo(User, {
	foreignKey: 'user_id'
});

Love.belongsTo(Post, {
	foreignKey: 'post_id'
});

User.hasMany(Love, {
	foreignKey: 'user_id'
});

Post.hasMany(Love, {
	foreignKey: 'post_id'
});

module.exports = { User, Post, Love };