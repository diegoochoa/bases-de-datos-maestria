const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sqlconnection = mysqlConnection.getConexion('envio');

app.set('view engine', 'ejs');

async function add(req, res) {
  res.render('add-shipment', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;

  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;
      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/shipments');
      });
    })
    .catch((err) => {
      res.status(500);
      res.render('shipments', {
        data: null
      });
    });
}

async function list(req, res) {
  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err) res.json(err);

        res.render('shipments', {
          data: rows
        });
      });
    })
    .catch((err) => {
      res.status(500);
      res.render('shipments', {
        data: []
      });
    });
}

async function _delete(req, res) {
  const id = req.params.numero_guia;

  sitio1.query('DELETE FROM envios WHERE numero_guia = ?', [id], (err, rows) => {
    res.redirect('/shipments');
  });
}

async function edit(req, res) {
  const id = req.params.numero_guia;
  sitio1.query('SELECT * FROM envios WHERE numero_guia = ?', [id], (err, rows) => {
    if (!err) {
      res.render('add-shipment', {
        data: rows[0]
      });
    }
  });
}

async function update(req, res) {
  const id = req.params.numero_guia;
  const data = req.body;

  sitio1.query('UPDATE envios SET ? WHERE numero_guia = ?', [data, id], (err, rows) => {
    res.redirect('/shipments');
  });
}

module.exports = {
  add,
  save,
  list,
  _delete,
  edit,
  update
};
