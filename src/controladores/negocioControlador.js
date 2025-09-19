const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarNegocio = async (req, res) =>{
    try {
        const lista = await db.negocio.findAll({
            include: [
        { model: db.persona },
        { model: db.ciudad }
      ]
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
}
const listarReporteNegocio = async (req, res) => {
  try {
    const { idciudad, razon_social, desde, hasta } = req.query;

    const where = {};
    if (idciudad) {
      where.idciudad = idciudad;
    }
    if (razon_social) {
      where.razon_social = {
        [Op.iLike]: `%${razon_social}%`,
      };
    }
    if (desde && hasta) {
      where.fecha = {
        [Op.between]: [desde, hasta],
      };
    } else if (desde) {
      where.fecha = { [Op.gte]: desde };
    } else if (hasta) {
      where.fecha = { [Op.lte]: hasta };
    }

   const lista = await db.negocio.findAll({
  where,
  include: [
    {
      model: db.persona,
      attributes: ['nombre', 'ap_paterno', 'ap_materno'],
    },
    {
      model: db.ciudad, // ✅ Esto es correcto
    }
  ],
  order: [['fecha', 'DESC']],
});


    return res.json(lista);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al generar el reporte de negocios" });
  }
};

const listarNegocioID = async (req, res) => {
    try {
        const idpersona = req.params.idpersona;
        const lista = await db.negocio.findAll({
            where: { idpersona },
            include: [
            {model: db.persona},
             {model: db.ciudad}
            ]
        });
        return res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al listar librerías' });
    }
};
const registrarNegocio = async (req, res) => {
    try {
        req.body.idpersona = req.body.persona?.idpersona;
        req.body.idciudad = req.body.ciudad?.idciudad;
        const persona = await db.negocio.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};

// PUT: Modificar persona
const modificarNegocio = async (req, res) => {
    const id = req.params.id;
    try {
        req.body.idpersona = req.body.persona?.idpersona;
        req.body.idciudad = req.body.ciudad?.idciudad;
        await db.negocio.update(req.body, { where: { idnegocio: id } });
        res.status(200).json({ mensaje: 'libreria modificada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar persona' });
    }
};
const eliminarNegocio = async (req, res) => {
    try {
        const id = req.params.xcod;
        await db.negocio.destroy({ where: { idnegocio: id } });
        res.status(200).json({ mensaje: 'Librería eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar librería' });
    }
}
module.exports = {listarNegocioID, listarNegocio, registrarNegocio, modificarNegocio, eliminarNegocio, listarReporteNegocio}