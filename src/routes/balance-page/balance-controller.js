const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const ComprasController = require('../purchases-page/purchases-controller');
const VentasController = require('../pos-page/pos-controller');
const SucursalesControllet = require('../branch-offices-page/branch-offices-controller');
const productsController = require('../products-page/products-controller');

app.set('view engine', 'ejs');

async function get(req, res) {
  var resultCompras = await ComprasController.get();
  var resultVentas = await VentasController.get();
  var resultSucursales = await SucursalesControllet.get();
  var resultDetalleCompra = await ComprasController.getDetalleCompra();
  var resultDetalleVenta = await VentasController.getDetalleVenta();


  var meses = [];
  for (let i = 0; i < 12; i++) {
    let ventas = resultVentas.filter(x => (new Date(x.fecha)).getMonth() == i);
    let compras = resultCompras.filter(x => (new Date(x.fecha)).getMonth() == i);

    var costo = 0, precio = 0;
    for (let venta of ventas) {
      let detalles = resultDetalleVenta.filter(x => x.id_venta == venta.id);

      for (let detalle of detalles) {
        let producto = await productsController.getById(detalle.id_producto);
        costo += producto.costo;
        precio += producto.precio;
      }
    }

    var totalCompras = 0;
    for (let compra of compras) {
      let detalles = resultDetalleCompra.filter(x => x.id_venta == compra.id);

      for (let detalle of detalles) {
        let producto = await productsController.getById(detalle.id_producto);
        totalCompras += producto.costo;
      }
    }

    let obj = {
      costo: costo,
      presupuesto: costo * 2,
      venta: precio,
      compra: totalCompras
    };
    meses.push(obj);
  }

  res.render('balance', {
    data: meses,
    sucursales: resultSucursales
  });
}

module.exports = {
  get
};
