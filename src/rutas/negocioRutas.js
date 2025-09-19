const express = require('express');
const router = express.Router();
const {verificarToken} = require('../middleware/token');

const {registrarNegocio, modificarNegocio,listarReporteNegocio, listarNegocioID, listarNegocio, eliminarNegocio, } = require('../controladores/negocioControlador')
router.get('/listarNegocio/:idpersona', verificarToken, listarNegocioID);
router.get('/listarNegocioCompleto', verificarToken, listarNegocio);
router.get('/listarReporteLibreria',verificarToken,listarReporteNegocio)
router.post('/registrarNegocio', registrarNegocio);
router.put('/modificarNegocio/:id',verificarToken,modificarNegocio);
router.delete('/eliminarNegocio/:xcod',verificarToken, eliminarNegocio);
module.exports = router
