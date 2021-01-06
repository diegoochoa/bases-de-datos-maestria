const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');

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
      console.log('agregando envio');
      const tabla = sqlconnection.tabla;
      console.log(tabla);
      console.log(data);
      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/shipments');
      });
    })
    .catch((err) => {
      console.log(err);
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

  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;
      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE numero_guia = ?`, [id], (err, rows) => {
        res.redirect('/shipments');
      });
    })
    .catch((err) => {
      res.status(500);
      res.redirect('/shipments');
    });
}

async function edit(req, res) {
  const id = req.params.numero_guia;
  mysqlConnection.getConexion('envio').then((sqlconnection) => {
    const tabla = sqlconnection.tabla;
    sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE numero_guia = ?`, [id], (err, rows) => {
      res.render('add-shipment', {
        data: rows[0]
      });
    });
  });
}

async function update(req, res) {
  const id = req.body.numero_guia;
  const data = req.body;

  console.log(id, data);
  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;
      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE numero_guia = ?`, [data, id], (err, rows) => {
        res.redirect('/shipments');
      });
    })
    .catch((err) => {
      console.log(err);
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
