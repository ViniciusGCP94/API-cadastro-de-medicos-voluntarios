const express = require('express');
const app = express();
app.use(express.json());

const voluntariosRoutes = require('./routes/voluntariosRoutes.js');
app.use(voluntariosRoutes);

module.exports = app;