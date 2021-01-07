const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const branchOfficesController = require('../branch-offices-page/branch-offices-controller');

app.set('view engine', 'ejs');

async function list(req, res) {
  const { cookies } = req;
  console.log(cookies);
  const user = cookies.usuario_activo;

  mysqlConnection
    .getConexion('empleado')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err) res.json(err);

        res.render('employees', {
          data: rows
        });
      });
    })
    .catch((err) => {
      res.status(500);
      res.render('employees', {
        data: []
      });
    });
}

async function get() {
  var empleados = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('empleado')
        .then((sqlconnection) => {
          const tabla = sqlconnection.tabla;

          sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
            if (err) res.json(err);

            return resolve(rows);
          });
        })
        .catch((err) => {
          return resolve([]);
        });
    });
  };

  return await empleados();
}

async function get_emplopyees_pos(sitio) {
  var empleados = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('empleado')
        .then((sqlconnection) => {
          const tabla = sqlconnection.tabla;

          sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE sucursal=${sitio}`, (err, rows) => {
            if (err) res.json(err);

            return resolve(rows);
          });
        })
        .catch((err) => {
          return resolve([]);
        });
    });
  };

  return await empleados();
}

async function add(req, res) {
  var resultSucursales = await branchOfficesController.get();
  res.render('add-employee', {
    data: null,
    sucursales: resultSucursales
  });
}

async function save(req, res) {
  const data = req.body;

  mysqlConnection
    .getConexion('empleado')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;
      console.log('Agregando empleado');
      console.log(tabla);
      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/employees');
      });
    })
    .catch((err) => {
      res.status(500);
      res.render('add-employee', {
        data: null
      });
    });
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection
    .getConexion('empleado')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.redirect('/employees');
      });
    })
    .catch((err) => {
      res.status(500);
      res.redirect('/employees');
    });
}

async function edit(req, res) {
  var resultSucursales = await branchOfficesController.get();
  const id = req.params.id;

  mysqlConnection
    .getConexion('empleado')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.render('add-employee', {
          data: rows[0],
          sucursales: resultSucursales
        });
      });
    })
    .catch((err) => {
      res.status(500);
      res.redirect('/employees');
    });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection
    .getConexion('empleado')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/employees');
      });
    })
    .catch((err) => {
      res.status(500);
      res.redirect('/employees');
    });
}

module.exports = {
  list,
  get,
  add,
  save,
  _delete,
  edit,
  update,
  get_emplopyees_pos
};
