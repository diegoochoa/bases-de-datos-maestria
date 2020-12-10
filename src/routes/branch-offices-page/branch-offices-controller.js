const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sqlconnection = mysqlConnection.getConexion("sucursal");
const BD = sqlconnection.BD;
const tabla = sqlconnection.tabla;
const condicion = sqlconnection.condicion;

app.set('view engine', 'ejs');

async function list(req, res) {
  BD.query('SELECT * FROM sucursal2', (err, rows) => {
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

  BD.query('INSERT INTO sucursal2 SET ?', [data], (err, rows) =>{
    res.redirect('/branch-offices');
  });
}

async function _delete(req, res) {
  const id = req.params.id;

  BD.query('DELETE FROM sucursal2 WHERE id = ?', [id], (err, rows) =>{
    res.redirect('/branch-offices');
  });
}

async function edit(req, res) {
  const id = req.params.id;

  BD.query('SELECT * FROM sucursal2 WHERE id = ?', [id], (err, rows) =>{
    res.render('add-branch-office', {
      data: rows[0]
    });
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  BD.query('UPDATE sucursal2 SET ? WHERE id = ?', [data, id], (err, rows) =>{
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