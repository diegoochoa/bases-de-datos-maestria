const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sitio2 = mysqlConnection.conexionSitio2;

app.set('view engine', 'ejs');

async function list(req, res) {
  sitio2.query('SELECT * FROM sucursales', (err, rows) => {
    if (err)
      res.json(err);

    res.render('branch-offices', {
      data: rows
    });
  });
}

async function add(req, res) {
  res.render('add-branch-office', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;

  sitio2.query('INSERT INTO sucursales SET ?', [data], (err, rows) =>{
    res.redirect('/branch-offices');
  });
}

async function _delete(req, res) {
  const id = req.params.id;

  sitio2.query('DELETE FROM sucursales WHERE id = ?', [id], (err, rows) =>{
    res.redirect('/branch-offices');
  });
}

async function edit(req, res) {
  const id = req.params.id;

  sitio2.query('SELECT * FROM sucursales WHERE id = ?', [id], (err, rows) =>{
    res.render('add-branch-office', {
      data: rows[0]
    });
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  sitio2.query('UPDATE sucursales SET ? WHERE id = ?', [data, id], (err, rows) =>{
    res.redirect('/branch-offices');
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