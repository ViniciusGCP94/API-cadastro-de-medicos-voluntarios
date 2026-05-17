const express = require('express');
const app = express();
app.use(express.json());

const voluntariosRoutes = require('./routes/voluntariosRoutes');
app.use(voluntariosRoutes);

module.exports = app;