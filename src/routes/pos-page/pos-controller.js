const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function pos_page_controller(req, res) {
  res.render('pos');
}

module.exports = pos_page_controller;
