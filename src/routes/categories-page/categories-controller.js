const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function categories_page_controller(req, res) {
  res.render('categories');
}

module.exports = categories_page_controller;
