const { Sequelize, DataTypes } = require('sequelize')
const initModels = require('../modelos/init-models')
const dotenv = require('dotenv');
dotenv.config();

const sequelize= new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PSW, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
    port: 5432,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }, logging: false,
    // dialectOptions: {
    //     ssl: {  
    //         require: true,
    //         rejectUnauthorized: false,
    //     }
    // },
});
sequelize.authenticate().then(() => {
    console.log('Conectado a la base de datos!');
}).catch((err) => {
        console.log(err);
});


const db = initModels(sequelize); 
module.exports = { sequelize, db };