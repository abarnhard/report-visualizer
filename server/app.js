const path = require('path');
const express = require('express');
const parser = require('./lib/parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/../node_modules`));

app.get('/', (reg, res) => {
  res.render('index');
});

app.get('/graph', (req, res) => {
  const graph = parser.parseReports();

  res.json(graph);
});

module.exports = app;
