const express = require('express');
const app = express();
const passportLocal = require('passport-local').Strategy;
const passport = require('passport');
const mysqlConnection = require('../../../connection');

app.set('view engine', 'ejs');

passport.use(
  new passportLocal(function (username, password, done) {
    let data = null;
    mysqlConnection
      .getConexion('usuario')
      .then((sqlconnection) => {
        const tabla = sqlconnection.tabla;

        sqlconnection.BD.query(
          `SELECT * FROM ${tabla} WHERE correo = '${username}' AND contrasena = '${password}'`,
          (err, rows) => {
            if (err) console.log(err);

            data = rows[0];
            console.log(data);
            if (username === data.correo && password === data.contrasena) {
              return done(null, { id: 1, name: username });
            }
            done(null, false);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, { id: 1, name: 'Diego' });
});

async function login_page_controller(req, res) {
  res.render('login');
}

async function validate_login(req, res) {
  res.render('home');
}

module.exports = {
  login_page_controller,
  validate_login
};
