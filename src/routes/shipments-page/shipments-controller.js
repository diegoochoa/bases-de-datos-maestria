const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function shipments_page_controller(req, res) {
  res.render('shipments');
}

module.exports = shipments_page_controller;
