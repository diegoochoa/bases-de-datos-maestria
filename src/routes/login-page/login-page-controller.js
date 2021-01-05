const express = require('express');
const app = express();
const passportLocal = require('passport-local').Strategy;
const passport = require('passport');
const mysqlConnection = require('../../../connection');
var session = require('express-session');
const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');

passport.use(
  new passportLocal(function (username, password, done) {
    let data = null;
    mysqlConnection
      .getConexion('empleado')
      .then((sqlconnection) => {
        const tabla = sqlconnection.tabla;

        try {
          sqlconnection.BD.query(
            `SELECT correo, contrasena FROM ${tabla} WHERE correo = '${username}' AND contrasena = '${password}'`,
            (err, rows) => {
              if (err) console.log(err);

              data = rows[0];
              console.log(data);
              if (data !== undefined) {
                if (username === data.correo && password === data.contrasena) {
                  return done(null, { id: 1, name: username });
                }
              }

              done(null, false);
            }
          );
        } catch (err) {
          console.log(err);
        }
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
  done(null, { id: id, name: 'Diego' });
});

async function login_page_controller(req, res) {
  res.render('login');
}

async function validate_login(req, res, next) {
  var data;
  if (req.body.username === 'admin') {
    res.cookie('hola', req.body.username);
    next();
  } else {
    mysqlConnection.getConexion('empleado').then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(
        `SELECT sucursal FROM ${tabla} WHERE correo = '${req.body.username}' AND contrasena = '${req.body.password}'`,
        (err, rows) => {
          if (err) console.log(err);

          data = rows[0];
          console.log(data);
          if (data.sucursal === 1) {
            res.cookie('sucursal_activa', 1);
            next();
          } else if (data.sucursal === 2) {
            res.cookie('sucursal_activa', 2);
            next();
          }
        }
      );
    });
  }
}

async function validateCookies(req, res, next) {
  const { cookies } = req;
  console.log(cookies);
  res.render('home');
  next();
}

module.exports = {
  login_page_controller,
  validate_login,
  validateCookies
};
