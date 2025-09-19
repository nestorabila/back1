const { Sequelize, DataTypes } = require('sequelize');
const initModels = require('../modelos/init-models');
const dotenv = require('dotenv');

dotenv.config();

console.log("DB:", process.env.DB);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

// Conexión más estable usando la URL completa con sslmode=require
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PSW}@${process.env.DB_HOST}:5432/${process.env.DB}?sslmode=require`,
  {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // poner true si quieres ver queries
  }
);

// Verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a la base de datos correctamente!');
  })
  .catch((err) => {
    console.error('❌ Error de conexión a la base de datos:', err);
  });

// Inicializar modelos
const db = initModels(sequelize);

module.exports = { sequelize, db };
