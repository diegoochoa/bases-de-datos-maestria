const express = require('express');
const app = express();
const mysqlConnection = require('../../../connection');
const branchOfficesController = require('../branch-offices-page/branch-offices-controller');

app.set('view engine', 'ejs');

async function get(req, res) {
  var resultSucursales = await branchOfficesController.get();

  res.render('balance', {
    sucursales: resultSucursales
  });
}

module.exports = {
  get
};
