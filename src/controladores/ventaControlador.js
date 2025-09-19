const { db } = require("../config/database");
const rol = require("../modelos/rol");
const { Op } = require('sequelize');

const listarMetodo_Pago = async (req, res) =>{
    try {
        const lista = await db.metodo_pago.findAll({
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const listarPunto_Venta = async (req, res) =>{
    try {
        const lista = await db.punto_venta.findAll({
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 


module.exports = {listarPunto_Venta, listarMetodo_Pago}