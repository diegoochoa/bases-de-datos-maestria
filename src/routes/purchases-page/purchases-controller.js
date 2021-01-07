const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const productsController = require('../products-page/products-controller');

app.set('view engine', 'ejs');

async function list(req, res) {
  mysqlConnection.getConexion("compra")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla}`, (err, rows) => {
        if (err)
          res.json(err);

        res.render('purchases', {
          data: rows
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.render('purchases', {
        data: []
      });
    })
}

async function get() {
  var compras = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection.getConexion("compra")
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

  return await compras();
}

async function add(req, res) {
  const resultProducts = await productsController.get("ACTIVO");

  res.render('add-purchase', {
    data: null,
    productos: resultProducts,
  });
}

async function save(req, res) {
  const data = req.body;
  const compra = {
    fecha: data.fecha,
    total: data.total
  }

  mysqlConnection.getConexion("compra")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`INSERT INTO ${tabla} SET ?`, [compra], (err, row) => {
        for(let producto of data.productos){
          let jProducto = {
            id_compra: row.insertId,
            id_producto: producto.id
          };
          sqlconnection.BD.query(`INSERT INTO detalle_compra1 SET ?`, [jProducto]);

          productsController.setStatus(producto.id, producto.id_sucursal, "DISPONIBLE");
        }

        res.redirect('/purchases');
      });
    })
    .catch(err => {
      res.status(500);
      res.render('add-purchase', {
        data: null
      });
    })
}

async function _delete(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("compra")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        for(let producto of data.productos){
          let jProducto = {
            id_compra: row.insertId,
            id_producto: producto.id
          };
          sqlconnection.BD.query(`INSERT INTO detalle_compra1 SET ?`, [jProducto]);

          productsController.setStatus(producto.id, producto.id_sucursal, "ACTIVO");
        }

        res.redirect('/purchases');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/purchases');
    })
}

async function edit(req, res) {
  const id = req.params.id;

  mysqlConnection.getConexion("compra")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (err, rows) => {
        res.render('add-purchase', {
          data: rows[0]
        });
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/purchases');
    })
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  mysqlConnection.getConexion("compra")
    .then(sqlconnection => {
      const tabla = sqlconnection.tabla;

      sqlconnection.BD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (err, rows) => {
        res.redirect('/purchases');
      });
    })
    .catch(err => {
      res.status(500);
      res.redirect('/purchases');
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
