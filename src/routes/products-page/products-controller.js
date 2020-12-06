const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function products_page_controller(req, res) {
  res.render('products');
}

module.exports = products_page_controller;