const express = require('express');
const router = express.Router();
const upload = require('../uploads/uploadConfig');
const {verificarToken} = require('../middleware/token');
// const {obtenerCUIS} = require('../controladores/facturacionControlador')
// router.get('/obtener-cuis', obtenerCUIS);
module.exports = router