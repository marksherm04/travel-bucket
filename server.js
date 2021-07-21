const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');


const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelizeSess = {
	secret: 'Super super secret',
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize
	})
};

app.use(session(sequelizeSess))

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(require('./controllers'));

// turn on db and server connection
sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => console.log('Now listening and ready for travel!'));
});