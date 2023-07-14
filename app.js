require('dotenv').config();
const express = require('express');
const app = express();

const plansRouter = require('./plansRouter');

app.use(plansRouter);
app.use('*', (req, res) =>
  res.status(404).json({
    error: 'route not found',
  }),
);

module.exports = app;
