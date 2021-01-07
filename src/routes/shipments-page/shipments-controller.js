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
      for (let i = 1; i < sqlconnection.length; i++) {
        const tabla = sqlconnection[i].tabla;
        console.log(tabla);
        const query = `INSERT INTO ${tabla} SET ?`;

        sqlconnection[i].BD.query(query, [data], (err, rows) => {
          if (err) console.log(err);
        });
      }
      res.redirect('/shipments');
      console.log('agregando envio');
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
      const tabla = sqlconnection[2].tabla;
      sqlconnection[2].BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
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
  console.log(id);
  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      for (let i = 1; i < sqlconnection.length; i++) {
        const tabla = sqlconnection[i].tabla;
        console.log(tabla);

        sqlconnection[i].BD.query(`DELETE FROM ${tabla} WHERE numero_guia = ?`, [id], (err, rows) => {
          if (err) console.log(err);
        });
      }

      res.redirect('/shipments');
    })
    .catch((err) => {
      res.status(500);
      res.redirect('/shipments');
    });
}

async function edit(req, res) {
  const id = req.params.numero_guia;
  mysqlConnection.getConexion('envio').then((sqlconnection) => {
    const tabla = sqlconnection[2].tabla;

    sqlconnection[2].BD.query(`SELECT * FROM ${tabla} WHERE numero_guia = ?`, [id], (err, rows) => {
      res.render('add-shipment', {
        data: rows[0]
      });
    });
  });
}

async function update(req, res) {
  const id = req.params.numero_guia;
  const data = req.body;

  console.log(id, data);
  mysqlConnection
    .getConexion('envio')
    .then((sqlconnection) => {
      for (let i = 1; i < sqlconnection.length; i++) {
        const tabla = sqlconnection[i].tabla;
        console.log(tabla);

        sqlconnection[i].BD.query(`UPDATE ${tabla} SET ? WHERE numero_guia = ?`, [data, id], (err, rows) => {
          if (err) console.log(err);
        });
      }

      res.redirect('/shipments');
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
