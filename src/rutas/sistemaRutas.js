const express = require('express');
const router = express.Router();
const {verificarToken} = require('../middleware/token');
const {listarSistema,listarSistemaDTO, modificarSistema} = require('../controladores/sistemaControlador')
router.get('/listarSistema',verificarToken, listarSistema);
router.get('/listarSistemaDTO',listarSistemaDTO);
router.put('/modificarSistema/:id',verificarToken, modificarSistema);
module.exports = router