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

async function list_inventory(req, res) {
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

  res.render('inventory', {
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
  const id_sucursal = req.params.id_sucursal;

  mysqlConnection
    .getConexion('producto', parseInt(id_sucursal))
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
  const id_sucursal = req.params.id_sucursal;

  var producto = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('producto', parseInt(id_sucursal))
        .then(async (sqlconnection) => {
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
  const id_sucursal = req.params.id_sucursal;
  const data = req.body;

  if (parseInt(id_sucursal) == parseInt(data.id_sucursal))
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
  else {
    mysqlConnection
      .getConexion('producto', parseInt(id_sucursal))
      .then((sqlconnection) => {
        const tabla = sqlconnection.tabla;

        sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
          mysqlConnection
            .getConexion('producto', parseInt(data.id_sucursal))
            .then((sqlconnection) => {
              const tabla = sqlconnection.tabla;

              sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [data], (err, rows) => {
                res.redirect('/products');
              });
            })

            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        res.redirect('/products');
      });
  }
}

async function get(status) {
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
                  let query = `SELECT * FROM ${tabla}`;

                  if (status != null) query += ` WHERE status="${status}"`;

                  conection.BD.query(query, (err, rows) => {
                    if (err) throw err;

                    return resolve(rows);
                  });
                });
              };

              var resultProductosSitio = await productosSitio();
              resultSitios = resultSitios.concat(resultProductosSitio);
            }
            return resolve(resultSitios);
          } else {
            console.log('here');
            const tabla = sqlconnection.tabla;
            let query = `SELECT * FROM ${tabla}`;

            if (status != null) query += ` WHERE status="${status}"`;

            sqlconnection.BD.query(`query`, (err, rows) => {
              if (err) throw err;

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

  return resultProductos;
}

async function get_products_sitio(status, sitio) {
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
                  let query = `SELECT * FROM ${tabla} WHERE id_sucursal="${sitio}"`;

                  if (status != null) query += ` WHERE status="${status}"`;

                  conection.BD.query(query, (err, rows) => {
                    if (err) throw err;

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
            let query = `SELECT * FROM ${tabla}"`;

            if (status != null) query += ` AND WHERE status="${status}"`;

            sqlconnection.BD.query(`query`, (err, rows) => {
              if (err) throw err;

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

  return resultProductos;
}

module.exports = {
  list,
  add,
  save,
  _delete,
  edit,
  update,
  get,
  get_products_sitio,
  list_inventory
};
