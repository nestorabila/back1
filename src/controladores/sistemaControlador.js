const { db } = require("../config/database");
const rol = require("../modelos/rol");
const { Op } = require('sequelize');

const listarSistema = async (req, res) =>{
    try {
        const lista = await db.sistema.findAll({
            include: {model: db.ciudad}
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const listarSistemaDTO = async (req, res) => {
    try {
        const lista = await db.sistema.findAll({
            attributes: { exclude: ['nit', 'idsistema'] },
            include: {
                model: db.ciudad
            }
        });
        return res.json(lista);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al listar sistemas' });
    }
};

// PUT: Modificar catalogo
const modificarSistema = async (req, res) => {
    const id = req.params.id;
    try {
        req.body.idciudad = req.body.ciudad?.idciudad;
        await db.sistema.update(req.body, { where: { idsistema: id } });
        res.status(200).json({ mensaje: 'modificada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar' });
    }
};

module.exports ={listarSistema, modificarSistema, listarSistemaDTO};