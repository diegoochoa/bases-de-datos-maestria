const bodyParser = require('body-parser');
const express = require('express');
const router = require('./src/routes');

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('my secret'));
app.use(
  session({
    secret: 'my secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/', router);

const hostname = '127.0.0.1';
const port = 3000;
let server;
const start = async () =>
  new Promise((res) => {
    server = app.listen(port, () => {
      console.log('Server running...');
      res();
    });
  });

module.exports = {
  start,
  app
};

module.exports.stop = () => {
  server.close();
};
