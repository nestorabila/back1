const { Sequelize, DataTypes } = require('sequelize');
const initModels = require('../modelos/init-models');
const dotenv = require('dotenv');

dotenv.config();

// Log variables para verificar
console.log("DB:", process.env.DB);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

// Conexión a Neon
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PSW}@${process.env.DB_HOST}:5432/${process.env.DB}?sslmode=require`,
  {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: (msg) => console.log("🟢 SQL:", msg) // Muestra queries si quieres
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
