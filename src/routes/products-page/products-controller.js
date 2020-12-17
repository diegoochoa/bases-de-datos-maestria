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
        .getConexion('producto', null)
        .then(async (sqlconnection) => {
          if (Array.isArray(sqlconnection)) {
            var resultSitios = [];

            for (let conection of sqlconnection) {
              const tabla = conection.tabla;

              var productosSitio = (query) => {
                return new Promise((resolve, reject) => {
                  conection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
                    if (err) res.json(err);

                    return resolve(rows);
                  });
                });
              };

              var resultProductosSitio = await productosSitio();
              resultSitios = resultSitios.concat(resultProductosSitio);
            }
            return resolve(resultSitios);
          } else {
            const tabla = sqlconnection.tabla;
            sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
              if (err) res.json(err);

              return resolve(rows);
            });
          }
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
    .getConexion('producto', parseInt(data.id_sucursal))
    .then((sqlconnection) => {
      console.log(sqlconnection);
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
        res.redirect('/products');
      });
    })

    .catch((err) => {
      console.log(err);
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
        .then(async (sqlconnection) => {
          console.log(sqlconnection);

          if (Array.isArray(sqlconnection)) {
            for (let conection of sqlconnection) {
              const tabla = conection.tabla;
              console.log(tabla);

              var productosSitio = (query) => {
                return new Promise((resolve, reject) => {
                  conection.BD.query(`SELECT * FROM  ${tabla} WHERE id = ?`, [id], (err, rows) => {
                    if (err) res.json(err);

                    return resolve(rows);
                  });
                });
              };

              var resultProductosSitio = await productosSitio();
              if (resultProductosSitio.length > 0) return resolve(resultProductosSitio[0]);
            }
          } else {
            const tabla = sqlconnection.tabla;

            sqlconnection.BD.query(`SELECT * FROM  ${tabla} WHERE id = ?`, [id], (err, rows) => {
              if (err) res.json(err);

              return resolve(rows[0]);
            });
          }
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
    .getConexion('producto', parseInt(data.id_sucursal))
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

async function get(req, res) {
  var productos = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('producto', null)
        .then(async (sqlconnection) => {
          if (Array.isArray(sqlconnection)) {
            var resultSitios = [];

            for (let conection of sqlconnection) {
              const tabla = conection.tabla;

              var productosSitio = (query) => {
                return new Promise((resolve, reject) => {
                  conection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
                    if (err) res.json(err);

                    return resolve(rows);
                  });
                });
              };

              var resultProductosSitio = await productosSitio();
              resultSitios = resultSitios.concat(resultProductosSitio);
            }
            return resolve(resultSitios);
          } else {
            const tabla = sqlconnection.tabla;
            sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
              if (err) res.json(err);

              return resolve(rows);
            });
          }
        })
        .catch((err) => {
          return resolve([]);
        });
    });
  };

  var resultProductos = await productos();
  var resultCategorias = await categoriesController.get();
  var resultSucursales = await branchOfficesController.get();

  return resultProductos;
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
