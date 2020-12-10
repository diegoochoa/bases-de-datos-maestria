const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');

app.set('view engine', 'ejs');

async function list(req, res) {
  mysqlConnection.getConexion("categoria")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err)
          res.json(err);

        res.render('categories', {
          data: rows
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('categories', {
        data: []
      });
    })
}

async function add(req, res) {
  res.render('add-category', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;

  mysqlConnection.getConexion("categoria")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/categories');
      });
    })
    .catch(err => {
      res.status(500);
      res.render('add-category', {
        data: null
      });
    })
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("categoria")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.redirect('/categories');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/categories');
    })
}

async function edit(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("categoria")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.render('add-category', {
          data: rows[0]
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/categories');
    })
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection.getConexion("categoria")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/categories');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/categories');
    })
}

module.exports = {
  list,
  add,
  save,
  _delete,
  edit,
  update
};
