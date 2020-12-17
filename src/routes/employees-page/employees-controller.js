const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');

app.set('view engine', 'ejs');

async function list(req, res) {
  mysqlConnection.getConexion("empleado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err)
          res.json(err);

        res.render('employees', {
          data: rows
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('employees', {
        data: []
      });
    })
}

async function get() {
  var empleados = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection.getConexion("empleado")
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

  return await empleados();
}

async function add(req, res) {
  res.render('add-employee', {
    data: null
  });
}

async function save(req, res) {
  const data = req.body;
  
  mysqlConnection.getConexion("empleado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {

        res.redirect('/employees');
      });
    })
    .catch(err => {
      res.status(500);
      res.render('add-employee', {
        data: null
      });
    })
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("empleado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.redirect('/employees');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/employees');
    })
}

async function edit(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("empleado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.render('add-employee', {
          data: rows[0]
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/employees');
    })
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection.getConexion("empleado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/employees');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/employees');
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