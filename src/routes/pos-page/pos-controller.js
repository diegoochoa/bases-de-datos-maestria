const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const sqlconnection = mysqlConnection.getConexion('venta');
const products_controller = require('../products-page/products-controller');
const customers_controller = require('../customers-page/customers-controller');
const employees_controller = require('../employees-page/employees-controller');

app.set('view engine', 'ejs');

async function home(req, res) {
  const { cookies } = req;
  console.log(cookies);
  const resultProducts = await products_controller.get_products_sitio('DISPONIBLE', cookies.sucursal_activa);
  const resultCustomers = await customers_controller.get();
  const resultEmployees = await employees_controller.get_emplopyees_pos(cookies.sucursal_activa);

  res.render('pos', {
    productos: resultProducts,
    clientes: resultCustomers,
    empleados: resultEmployees
  });
}

async function save_sell(req, res) {
  const { cookies } = req;
  const sucursal_activa = cookies.sucursal_activa;
  const { productos } = req.body;
  const data = req.body;

  var totalprecio;
  let id_producto;
  let id_empleado;
  let total_atr;
  console.log('data', req.body);
  mysqlConnection
    .getConexion('venta')
    .then((sqlconnection) => {
      for (let i = 0; i < sqlconnection.length; i++) {
        if (sqlconnection[i].sitio == 1) {
          sqlconnection[0].central.query(`SELECT * FROM atributos WHERE id_fragmento = 1`, (err, rows) => {
            // if (err) res.json(err);

            id_empleado = rows[1].atributo;
            total_atr = rows[2].atributo;

            sqlconnection[i].BD1.query(
              `INSERT INTO ${sqlconnection[i].tabla} (${id_empleado}, ${total_atr}, status) VALUES (${req.body.numero_empleado},${req.body.venta_total}, ${req.body.tipo_envio})`,
              (err, rows) => {
                if (err) console.log(err);
              }
            );
            // sqlconnection[i].BD1.query(`SELECT costo, id FROM producto1 WHERE id = ${producto.id}`, (err, rows) => {
            //   if (err) console.log(err);
            //   try {
            //     totalprecio = rows[0].costo;
            //     id_producto = rows[0].id;
            //     console.log(id_producto);

            //   } catch (err) {
            //     console.log('Producto en sitio 2');
            //     sqlconnection[2].BD2.query(`SELECT costo, id FROM producto2 WHERE id = ${producto.id}`, (err, rows) => {
            //       totalprecio = rows[0].costo;
            //       id_producto = rows[0].id;
            //       console.log(rows);
            //       sqlconnection[i].BD1.query(
            //         `INSERT INTO ${sqlconnection[i].tabla} (${id_empleado}, ${total_atr}) VALUES (${req.body.numero_empleado},${req.body.venta_total})`,
            //         (err, rows) => {
            //           if (err) console.log(err);
            //         }
            //       );
            //     });
            //   }
            // });
          });
        } else if (sqlconnection[i].sitio == 2) {
          console.log(req.body.numero_cliente);
          sqlconnection[0].central.query(`SELECT * FROM atributos WHERE id_fragmento = 2`, (err, rows) => {
            if (err) res.json(err);
            let id_cliente = rows[1].atributo;
            const query = `INSERT INTO ${sqlconnection[i].tabla} (${id_cliente}) VALUES ('${req.body.numero_cliente}')`;
            sqlconnection[i].BD2.query(query, (err, row) => {
              if (err) console.log(err);
              for (let producto of productos) {
                let jProducto = {
                  id_venta: row.insertId,
                  id_producto: producto.id
                };
                sqlconnection[1].BD1.query(
                  `INSERT INTO detalle_venta1 (id_venta,id_producto,status) VALUES (${jProducto.id_venta},${jProducto.id_producto},${req.body.tipo_envio})`
                );

                products_controller.setStatus(producto.id, producto.id_sucursal, 'NO DISPONIBLE');
              }
            });
          });

          res.redirect('/pos');
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
          if (Array.isArray(sqlconnection)) {
            var resultSitios = [];

            for (let conection of sqlconnection) {
              if (conection.tabla !== undefined) {
                var tabla = conection.tabla;

                var ventasSitio = (query) => {
                  return new Promise((resolve, reject) => {
                    let query = `SELECT * FROM ${tabla}`;

                    // if (status != null)
                    //   query += ` WHERE status="${status}"`;

                    conection.BD.query(query, (err, rows) => {
                      if (err) throw err;

                      return resolve(rows);
                    });
                  });
                };

                var resultVentasSitio = await ventasSitio();

                if (resultSitios.length > 0) {
                  resultSitios.map((venta) => {
                    let venta2 = resultVentasSitio.find((x) => x.id === venta.id);

                    let obj_unidos = Object.assign(venta, venta2);

                    return obj_unidos;
                  });
                } else resultSitios = resultSitios.concat(resultVentasSitio);
              }
            }
            return resolve(resultSitios);
          } else {
            const tabla = sqlconnection.tabla;
            let query = `SELECT * FROM ${tabla}`;

            // if (status != null)
            //   query += ` WHERE status="${status}"`;

            sqlconnection.BD.query(query, (err, rows) => {
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

  const resultVentas = await ventas();
  const resultCustomers = await customers_controller.get();
  const resultEmployees = await employees_controller.get();

  res.render('sales', {
    data: resultVentas,
    empleados: resultEmployees,
    clientes: resultCustomers
  });
}

async function print(req, res) {
  var ventas = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('venta', null)
        .then(async (sqlconnection) => {
          if (Array.isArray(sqlconnection)) {
            var resultSitios = [];

            for (let conection of sqlconnection) {
              if (conection.tabla !== undefined) {
                var tabla = conection.tabla;

                var ventasSitio = (query) => {
                  return new Promise((resolve, reject) => {
                    let query = `SELECT * FROM ${tabla}`;

                    // if (status != null)
                    //   query += ` WHERE status="${status}"`;

                    conection.BD.query(query, (err, rows) => {
                      if (err) throw err;

                      return resolve(rows);
                    });
                  });
                };

                var resultVentasSitio = await ventasSitio();

                if (resultSitios.length > 0) {
                  resultSitios.map((venta) => {
                    let venta2 = resultVentasSitio.find((x) => x.id === venta.id);

                    let obj_unidos = Object.assign(venta, venta2);

                    return obj_unidos;
                  });
                } else resultSitios = resultSitios.concat(resultVentasSitio);
              }
            }
            return resolve(resultSitios);
          } else {
            const tabla = sqlconnection.tabla;
            let query = `SELECT * FROM ${tabla}`;

            // if (status != null)
            //   query += ` WHERE status="${status}"`;

            sqlconnection.BD.query(query, (err, rows) => {
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

  const resultVentas = await ventas();
  const resultCustomers = await customers_controller.get();
  const resultEmployees = await employees_controller.get();

  res.render('sales-print', {
    data: resultVentas,
    empleados: resultEmployees,
    clientes: resultCustomers
  });
}

async function get_to_ship() {
  var to_ship = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('venta')
        .then((sqlconnection) => {
          const tabla = sqlconnection[1].tabla;

          sqlconnection[1].BD1.query(`SELECT * FROM ${tabla} WHERE status=1`, (err, rows) => {
            if (err) res.json(err);

            return resolve(rows);
          });
        })
        .catch((err) => {
          return resolve([]);
        });
    });
  };

  return await to_ship();
}

async function getDetalleVenta() {
  var compras = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('detalle_venta')
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

  return await compras();
}

async function setStatus(id, newStatus) {
  const jStatus = {
    status: newStatus
  };

  mysqlConnection
    .getConexion('venta')
    .then((sqlconnection) => {
      const tabla = sqlconnection[1].tabla;

      sqlconnection[1].BD1.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [jStatus, id]);

      return;
    })
    .catch((err) => {});

  return;
}

async function get() {
  var ventas = (query) => {
    return new Promise((resolve, reject) => {
      mysqlConnection
        .getConexion('venta', null)
        .then(async (sqlconnection) => {
          if (Array.isArray(sqlconnection)) {
            var resultSitios = [];

            for (let conection of sqlconnection) {
              if (conection.tabla !== undefined) {
                var tabla = conection.tabla;

                var ventasSitio = (query) => {
                  return new Promise((resolve, reject) => {
                    let query = `SELECT * FROM ${tabla}`;

                    // if (status != null)
                    //   query += ` WHERE status="${status}"`;

                    conection.BD.query(query, (err, rows) => {
                      if (err) throw err;

                      return resolve(rows);
                    });
                  });
                };

                var resultVentasSitio = await ventasSitio();

                if (resultSitios.length > 0) {
                  resultSitios.map((venta) => {
                    let venta2 = resultVentasSitio.find((x) => x.id === venta.id);

                    let obj_unidos = Object.assign(venta, venta2);

                    return obj_unidos;
                  });
                } else resultSitios = resultSitios.concat(resultVentasSitio);
              }
            }
            return resolve(resultSitios);
          } else {
            const tabla = sqlconnection.tabla;
            let query = `SELECT * FROM ${tabla}`;

            // if (status != null)
            //   query += ` WHERE status="${status}"`;

            sqlconnection.BD.query(query, (err, rows) => {
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

  return await ventas();
}

module.exports = {
  home,
  save_sell,
  list,
  print,
  get_to_ship,
  setStatus,
  getDetalleVenta,
  get
};
