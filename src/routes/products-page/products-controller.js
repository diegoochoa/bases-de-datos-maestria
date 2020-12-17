const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const categoriesController = require('../categories-page/categories-controller');
const branchOfficesController = require('../branch-offices-page/branch-offices-controller');

app.set('view engine', 'ejs');

async function list(req, res) {
  var productos = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('producto')
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

  var resultProductos = await productos();
  var resultCategorias = await categoriesController.get();
  var resultSucursales = await branchOfficesController.get();

  res.render('products', {
    data: resultProductos,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function add(req, res) {
  var resultCategorias = await categoriesController.get();
  var resultSucursales = await branchOfficesController.get();

  res.render('add-product', {
    data: null,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function save(req, res) {
  const data = req.body;

  mysqlConnection
    .getConexion('producto')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/products');
      });
    })
    .catch((err) => {
      res.redirect('/products');
    });
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection
    .getConexion('producto')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.redirect('/products');
      });
    })
    .catch((err) => {
      res.redirect('/products');
    });
}

async function edit(req, res) {
  const id = req.params.id;

  var producto = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('producto')
        .then((sqlconnection) => {
          const tabla = sqlconnection.tabla;

          sqlconnection.BD.query(`SELECT * FROM  ${tabla} WHERE id = ?`, [id], (err, rows) => {
            if (err) res.json(err);

            return resolve(rows[0]);
          });
        })
        .catch((err) => {
          return resolve(null);
        });
    });
  };

  var resultProducto = await producto();
  var resultCategorias = await categoriesController.get();
  var resultSucursales = await branchOfficesController.get();

  res.render('add-product', {
    data: resultProducto,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection
    .getConexion('producto')
    .then((sqlconnection) => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/products');
      });
    })
    .catch((err) => {
      res.redirect('/products');
    });
}

async function get() {
  var productos = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('producto')
        .then((sqlconnection) => {
          console.log(sqlconnection);
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

  return await productos();
}

module.exports = {
  list,
  add,
  save,
  _delete,
  edit,
  update,
  get
};
