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

async function add(req, res) {
  res.render('add-category', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;

  sitio2.query('INSERT INTO categorias SET ?', [data], (err, rows) =>{
    res.redirect('/categories');
  });
}

async function _delete(req, res) {
  const id = req.params.id;

  sitio2.query('DELETE FROM categorias WHERE id = ?', [id], (err, rows) =>{
    res.redirect('/categories');
  });
}

async function edit(req, res) {
  const id = req.params.id;

  sitio2.query('SELECT * FROM categorias WHERE id = ?', [id], (err, rows) =>{
    res.render('add-category', {
      data: rows[0]
    });
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  sitio2.query('UPDATE categorias SET ? WHERE id = ?', [data, id], (err, rows) =>{
    res.redirect('/categories');
  });
}

module.exports = {
  list,
  add,
  save,
  _delete,
  edit,
  update
};
