const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function home_page_controller(req, res) {
  res.render('login');
}

module.exports = home_page_controller;
