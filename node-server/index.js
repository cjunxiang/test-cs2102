require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./api.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors())
app.use('/', apiRouter);

app.listen(PORT || 3001, () => {
  console.log(`Database user: ${process.env.HEROKU_USER}.`);
  console.log(`App running on port ${PORT}.`);
});
