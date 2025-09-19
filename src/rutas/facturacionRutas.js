const express = require('express');
const router = express.Router();
const upload = require('../uploads/uploadConfig');
const path = require('path');
const fs = require('fs');
const {verificarToken} = require('../middleware/token');
const {listarFactura,GenerarReporteFactura, anularFactura, buscarFactura,  registrarFactura} = require('../controladores/facturacionControlador')
router.get('/listarFactura', verificarToken, listarFactura);
router.post('/registrarFactura',verificarToken, registrarFactura);
router.put('/anularFactura/:xcod',verificarToken, anularFactura);
router.get('/buscarFactura',verificarToken, buscarFactura);
router.get('/listarReporteFactura',verificarToken,GenerarReporteFactura)

router.get('/factura/:idfactura/pdf', verificarToken, (req, res) => {
  const { idfactura } = req.params;

  // Ruta de la carpeta donde guardas las facturas
  const carpeta = path.join(__dirname, '../facturas_xml');
  const rutaArchivoPDF = path.join(carpeta, `factura_${idfactura}.pdf`);

  if (fs.existsSync(rutaArchivoPDF)) {
    res.download(rutaArchivoPDF, `factura_${idfactura}.pdf`);
  } else {
    res.status(404).json({ error: 'Factura no encontrada' });
  }
});
module.exports = router