'use strict';

/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const path = require('path');
const createRenderer = require('../index');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', createRenderer('inferno'));

app.get('*', (req, res) => {
	res.locals = {
		title: 'Homepage',
		path: req.path,
	};
	res.render('home', { name: 'Sam' });
});

app.listen(3000);
