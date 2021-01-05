const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sqlconnection = mysqlConnection.getConexion('venta');
const products_controller = require('../products-page/products-controller');
const customers_controller = require('../customers-page/customers-controller');
const employees_controller = require('../employees-page/employees-controller');

app.set('view engine', 'ejs');

async function home(req, res) {
  const resultProducts = await products_controller.get();
  const resultCustomers = await customers_controller.get();
  const resultEmployees = await employees_controller.get();
  res.render('pos', {
    productos: resultProducts,
    clientes: resultCustomers,
    empleados: resultEmployees
  });
}

async function save_sell(req, res) {
  const data = req.body;
  console.log(data);
  const resultProducts = await products_controller.get();

  mysqlConnection
    .getConexion('venta')
    .then((sqlconnection) => {
      for (let i = 0; i < sqlconnection.length; i++) {
        if (sqlconnection[i].sitio == 1) {
          sqlconnection[0].central.query(`SELECT * FROM atributos WHERE id_fragmento = 1`, (err, rows) => {
            if (err) res.json(err);

            let id_empleado = rows[1].atributo;
            let total_atr = rows[2].atributo;
            let totalprecio;
            sqlconnection[i].BD1.query(`SELECT costo FROM producto1 WHERE id = ${data.producto}`, (err, rows) => {
              if (err) res.json(err);
              try {
                totalprecio = rows[0].costo;
              } catch (err) {
                console.log('Producto en sitio 2');
                sqlconnection[2].BD2.query(`SELECT costo FROM producto2 WHERE id = ${data.producto}`, (err, rows) => {
                  totalprecio = rows[0].costo;
                  sqlconnection[i].BD1.query(
                    `INSERT INTO ${sqlconnection[i].tabla} (${id_empleado}, ${total_atr}) VALUES (${data.empleado},${totalprecio})`,
                    (err, rows) => {
                      if (err) res.json(err);
                    }
                  );
                });
              }

              sqlconnection[i].BD1.query(
                `INSERT INTO ${sqlconnection[i].tabla} (${id_empleado}, ${total_atr}) VALUES (${data.empleado},${totalprecio})`,
                (err, rows) => {
                  if (err) res.json(err);
                }
              );
            });
          });
        } else if (sqlconnection[i].sitio == 2) {
          sqlconnection[0].central.query(`SELECT * FROM atributos WHERE id_fragmento = 2`, (err, rows) => {
            if (err) res.json(err);
            console.log(rows);
            let id_cliente = rows[1].atributo;
            let fecha = rows[2].atributo;
            let date = new Date().toLocaleDateString();
            sqlconnection[i].BD2.query(
              `INSERT INTO ${sqlconnection[i].tabla} (${id_cliente}, ${fecha}) VALUES (${data.numero_cliente},${date})`,
              (err, rows) => {
                if (err) res.json(err);
                res.redirect('/pos');
              }
            );
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.render('pos', {
        productos: resultProducts
      });
    });
}

async function list(req, res) {
  var ventas = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('venta', null)
        .then(async (sqlconnection) => {
          return resolve([]);
        })
        .catch((err) => {
          return resolve([]);
        });
    });
  };

  const resultVentas = await ventas();
  const resultCustomers = await customers_controller.get();
  const resultEmployees = await employees_controller.get();

  res.render('sales', {
    data: resultVentas,
    empleados: resultEmployees,
    clientes: resultCustomers
  });
}

module.exports = {
  home,
  save_sell,
  list
};
