const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sitio2 = mysqlConnection.conexionSitio2;

app.set('view engine', 'ejs');

async function list(req, res) {
  sitio2.query('SELECT * FROM categorias', (err, rows) => {
    if (err)
      res.json(err);

    res.render('categories', {
      data: rows
    });
  });
}

module.exports = {
  list
};
