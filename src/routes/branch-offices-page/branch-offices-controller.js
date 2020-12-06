const express = require('express');
const app = express();

app.set('view engine', 'ejs');

async function branch_offices_page_controller(req, res) {
  res.render('branch-offices');
}

module.exports = branch_offices_page_controller;
