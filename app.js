
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

app.use(cors({
  origin: ['https://luciwebv2.onrender.com', 'http://localhost:4200'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
//cualquier api que hagas al servidor siempre va pasar pruimero por este archivo app.js de aqui se rediriguen a las rutas
app.get('/', (req, res) => {
    res.send('API de luci funcionando correctamente');
});
// Middleware para analizar JSON
app.use(express.json());//para que sis se envia json del cliente el servidor lo entienda
app.use(express.urlencoded({ extended: true}))
// app - rutas(aproabdo por token) - recienpasa a controladores
const personaRoute = require('./src/rutas/personaRutas')
app.use('/api',personaRoute)

const productoRoute = require('./src/rutas/productoRutas')
app.use('/api',productoRoute)

// const facturacionRoute = require('./src/rutas/facturacionRutas')
// app.use('/api', facturacionRoute);

const pedidoRoute = require('./src/rutas/pedidosRutas')
app.use('/api',pedidoRoute)

const facturaRoute = require('./src/rutas/facturacionRutas')
app.use('/api',facturaRoute)

const pedidodetRoute = require('./src/rutas/detallePedidoRutas')
app.use('/api',pedidodetRoute)

const empaqueRoute = require('./src/rutas/empaqueRutas')
app.use('/api',empaqueRoute)

const ciudadRoute = require('./src/rutas/ciudadRutas')
app.use('/api',ciudadRoute)
// Servir imágenes públicamente desde esta ruta:
app.use('/imagenPersona', express.static(path.join(__dirname, './src/uploads/imgPersona')));
// Servir imágenes públicamente desde esta ruta:
app.use('/imagenes', express.static(path.join(__dirname, './src/uploads/imgCatalogo')));

const rolRoute = require('./src/rutas/rolRutas')
app.use('/api',rolRoute)

const credencialRoute = require('./src/rutas/credencialRutas')
app.use('/api',credencialRoute)

const negocioRoute = require('./src/rutas/negocioRutas')
app.use('/api',negocioRoute)

const compraRoute = require('./src/rutas/comprasRutas')
app.use('/api',compraRoute)

const detCompraRoute = require('./src/rutas/detalleCompraRutas')
app.use('/api',detCompraRoute)

const CategoriaRoute = require('./src/rutas/categoriaRutas')
app.use('/api',CategoriaRoute)

const ProveedorRoute = require('./src/rutas/proveedorRutas')
app.use('/api',ProveedorRoute)

const CatalogoRoute = require('./src/rutas/catalogoRutas')
app.use('/api',CatalogoRoute)

const SistemaRoute = require('./src/rutas/sistemaRutas')
app.use('/api',SistemaRoute)

const LoginRoute = require('./src/rutas/IniciarSesionRutas')
app.use('/api',LoginRoute)

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
