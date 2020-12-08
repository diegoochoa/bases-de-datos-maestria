const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sitio2 = mysqlConnection.conexionSitio2;

app.set('view engine', 'ejs');

async function list(req, res) {
  var productos = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM producto2', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var categorias = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM categorias', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var sucursales = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM sucursales', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var resultProductos = await productos();
  var resultCategorias = await categorias();
  var resultSucursales = await sucursales();

  res.render('products', {
    data: resultProductos,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function add(req, res) {
  var categorias = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM categorias', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var sucursales = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM sucursales', (err, rows) => {
        if (err)
          res.json(err);
        return resolve(rows);
      });
    });
  }

  var resultCategorias = await categorias();
  var resultSucursales = await sucursales();

  res.render('add-product', {
    data: null,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function save(req, res) {
  const data = req.body;

  console.log(data);
  sitio2.query('INSERT INTO producto2 SET ?', [data], (err, rows) => {
    res.redirect('/products');
  });
}

async function _delete(req, res) {
  const id = req.params.id;

  sitio2.query('DELETE FROM producto2 WHERE id = ?', [id], (err, rows) => {
    res.redirect('/products');
  });
}

async function edit(req, res) {
  const id = req.params.id;

  var producto = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM producto2 WHERE id = ?', [id], (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows[0]);
      });
    });
  }

  var categorias = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM categorias', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var sucursales = (query) => {
    return new Promise((resolve, reject) => {
      sitio2.query('SELECT * FROM sucursales', (err, rows) => {
        if (err)
          res.json(err);

        return resolve(rows);
      });
    });
  }

  var resultProducto = await producto();
  var resultCategorias = await categorias();
  var resultSucursales = await sucursales();

  res.render('add-product', {
    data: resultProducto,
    categorias: resultCategorias,
    sucursales: resultSucursales
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  sitio2.query('UPDATE producto2 SET ? WHERE id = ?', [data, id], (err, rows) => {
    res.redirect('/products');
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