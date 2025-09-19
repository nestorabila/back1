const { Sequelize, DataTypes } = require('sequelize');
const initModels = require('../modelos/init-models');
const dotenv = require('dotenv');

dotenv.config();

// Log variables para verificar
console.log("DB:", process.env.DB);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

// Conexión a Neon
// Conexión a Neon con pool y reconexión mejorados
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PSW}@${process.env.DB_HOST}:5432/${process.env.DB}?sslmode=require`,
  {
    dialect: 'postgres',
    pool: {
      max: 5,       // Máximo de conexiones simultáneas
      min: 0,       // Mínimo de conexiones
      acquire: 30000, // Tiempo máximo para adquirir una conexión
      idle: 10000,    // Tiempo de inactividad antes de liberar
      evict: 10000,   // Cierra conexiones inactivas para evitar timeouts
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    retry: {
      max: 5,       // Reintenta 5 veces si hay fallo de conexión
    },
    logging: (msg) => console.log("🟢 SQL:", msg), // Opcional: ver queries
  }
);


// Test de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a Neon establecida correctamente!');
  } catch (err) {
    console.error('❌ Error al conectar con Neon:', err);
  }
})();

// Inicializar modelos
const db = initModels(sequelize);

module.exports = { sequelize, db };
