const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function add_shipments_page_controller(req, res) {
  res.render('add-shipment');
}

module.exports = add_shipments_page_controller;
