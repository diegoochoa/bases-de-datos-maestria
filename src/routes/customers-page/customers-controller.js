const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');

app.set('view engine', 'ejs');

async function list(req, res) {
  mysqlConnection.getConexion("cliente")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err)
          res.json(err);

        res.render('customers', {
          data: rows
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('customers', {
        data: []
      });
    })
}

async function get() {
  var clientes = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection.getConexion("cliente")
        .then(sqlconnection => {
          const tabla = sqlconnection.tabla;

          sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
            if (err)
              res.json(err);

              return resolve(rows);
          });
        })
        .catch(err => {
          return resolve([]);
        })
    });
  }

  return await clientes();
}

async function add(req, res) {
  res.render('add-customer', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;

  mysqlConnection.getConexion("cliente")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/customers');
      });
    })
    .catch(err => {
      res.status(500);
      res.render('add-customer', {
        data: null
      });
    })
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("cliente")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.redirect('/customers');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/customers');
    })
}

async function edit(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("cliente")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.render('add-customer', {
          data: rows[0]
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/customers');
    })
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection.getConexion("cliente")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/customers');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/customers');
    })
}

module.exports = {
  list,
  get,
  add,
  save,
  _delete,
  edit,
  update
};
