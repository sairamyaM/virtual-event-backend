require('dotenv').config({ path: '.env.test' });

const express = require('express');
const app = express();

app.use(express.json());

app.use('/auth', require('../routes/auth'));
app.use('/events', require('../routes/events'));

module.exports = app;
