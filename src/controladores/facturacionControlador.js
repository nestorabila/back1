const { db } = require("../config/database");
const rol = require("../modelos/rol");
const { Op } = require('sequelize');
const axios = require('axios');
const soap = require('soap');

const soap = require('soap');

// const obtenerCUIS = async (req, res) => {
//   const wsdlUrl = 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos?wsdl';

//   const args = {
//     SolicitudCuis: {
//       nit: 1020703025,
//       codigoSistema: '71A08E77A18E862F5A4E',
//       codigoAmbiente: 2,
//       codigoModalidad: 1,
//       codigoSucursal: 0,
//       codigoPuntoVenta: 0
//     }
//   };

//   try {
//     const client = await soap.createClientAsync(wsdlUrl);

    
//     const apiKey = 'TU_API_KEY_AQUI'; 
//     const header = {
//       ApiKey: apiKey
//     };
//     client.addHttpHeader('apikey', apiKey); 


//     client.cuis(args, (err, result) => {
//       if (err) {
//         console.error("❌ Error al llamar a 'cuis':", err);
//         return res.status(500).json({ error: 'Error al obtener CUIS (SOAP)' });
//       }

//       console.log("✅ Resultado CUIS recibido:", result);
//       res.json(result);
//     });

//   } catch (error) {
//     console.error('🔥 Error al crear cliente SOAP:', error);
//     res.status(500).json({ error: 'Error al obtener CUIS' });
//   }
// };

// module.exports = { obtenerCUIS };


