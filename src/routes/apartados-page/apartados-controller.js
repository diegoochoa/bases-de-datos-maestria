const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const productsController = require('../products-page/products-controller');
const categoriesController = require('../categories-page/categories-controller');
const customers_controller = require('../customers-page/customers-controller');

app.set('view engine', 'ejs');

async function list(req, res) {
  mysqlConnection.getConexion("apartado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err)
          res.json(err);

        res.render('apartados', {
          data: rows
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('apartados', {
        data: []
      });
    })
}

async function get() {
  var apartados = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection.getConexion("apartado")
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

  return await apartados();
}

async function add(req, res) {
  const resultProducts = await productsController.get("DISPONIBLE");
  const resultCustomers = await customers_controller.get();

  res.render('add-apartado', {
    data: null,
    productos: resultProducts,
    clientes: resultCustomers,
  });
}

async function save(req, res) {
  const data = req.body;
  const apartado = {
    fecha: data.fecha,
    fecha_limite: data.fecha_limite,
    id_cliente: data.id_cliente,
    monto_abonado: data.monto_abonado,
    total: data.total,
  }

  mysqlConnection.getConexion("apartado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [apartado], (err, row) => {
        for (let producto of data.productos) {
          let jProducto = {
            id_apartado: row.insertId,
            id_producto: producto.id
          };
          sqlconnection.BD.query(`INSERT INTO detalle_apartado1 SET ?`, [jProducto]);

          productsController.setStatus(producto.id, producto.id_sucursal, "APARTADO");
        }

        res.redirect('/apartados');
      });
    })
    .catch(err => {
      res.status(500);
      res.render('add-apartado', {
        data: null
      });
    })
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("detalle_apartado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id_apartado =${id}`, async (err, rows) => {
        if (err) res.json(err);

        for (let detalle of rows) {
          let producto = await productsController.getById(detalle.id_producto);
          await productsController.setStatus(producto.id, producto.id_sucursal, "DISPONIBLE");
        }
      });

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id_apartado = ?`, [id], (err, rows) => {
        mysqlConnection.getConexion("apartado")
          .then(sqlconnection => {
            const tabla = sqlconnection.tabla;

            sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
              res.redirect('/apartados');
            });
          })
          .catch(err => {
            res.redirect('/apartados');
          })
      });
    })
    .catch(err => {
      res.redirect('/apartados');
    })
}

async function edit(req, res) {
  const id = req.params.id;

  sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id_apartado =${id}`, async (err, rows) => {
    if (err) res.json(err);

    var productos = [];
    for (let detalle of rows) {
      let producto = await productsController.getById(detalle.id_producto);
      productos.push(producto);
    }

    var resultCategorias = await categoriesController.get();

    res.render('apartado-detail', {
      data: productos,
      folio: rows[0].id_apartado,
      categorias: resultCategorias,
    });
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection.getConexion("apartado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/apartados');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/apartados');
    })
}

async function detalleApartado(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("detalle_apartado")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id_apartado =${id}`, async (err, rows) => {
        if (err) res.json(err);

        var productos = [];
        for (let detalle of rows) {
          let producto = await productsController.getById(detalle.id_producto);
          productos.push(producto);
        }

        var resultCategorias = await categoriesController.get();

        res.render('apartado-detail', {
          data: productos,
          folio: rows[0].id_apartado,
          categorias: resultCategorias,
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('apartado-detail', {
        data: []
      });
    })
}

module.exports = {
  list,
  get,
  add,
  save,
  _delete,
  edit,
  update,
  detalleApartado
};
