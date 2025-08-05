const { db } = require("../config/database");
const { Op } = require('sequelize');

const listarPersonas = async (req, res) =>{
    try {
        const lista = await db.persona.findAll({
            include: {model: db.rol}
        })
        return res.json(lista)
    } catch (error) {
        console.log(error);
        
    }
} 

const GenerarReportePersona = async (req, res) => {
  try {
    const { rol, nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
      include: [
        {
          model: db.rol,
          attributes: ['idrol', 'nombre']
        },
         {
      model: db.credencial, // 👈 aquí incluyes credencial
      attributes: ['usuario']
    }
      ]
    };

    // Filtro por rol (idrol)
    if (rol) {
      filtros.where.idrol = rol;
    }

    // Filtro por nombre o apellidos (similar a búsqueda por texto)
    if (nombre) {
      filtros.where[Op.or] = [
        { nombre: { [Op.iLike]: `%${nombre}%` } },
        { ap_paterno: { [Op.iLike]: `%${nombre}%` } },
        { ap_materno: { [Op.iLike]: `%${nombre}%` } }
      ];
    }

    // Filtro por estado (1 = Activo, 0 = Bloqueado, etc.)
    if (estado) {
      filtros.where.estado = estado;
    }

    // Filtro por fecha
    if (fechaDesde && fechaHasta) {
      filtros.where.fecha = {
        [Op.between]: [fechaDesde, fechaHasta]
      };
    } else if (fechaDesde) {
      filtros.where.fecha = {
        [Op.gte]: fechaDesde
      };
    } else if (fechaHasta) {
      filtros.where.fecha = {
        [Op.lte]: fechaHasta
      };
    }

    const resultado = await db.persona.findAll(filtros);
    return res.json(resultado);
  } catch (error) {
    console.error("Error al filtrar personas:", error);
    res.status(500).json({ mensaje: "Error al filtrar personas" });
  }
};

const listarPersonasFiltradas = async (req, res) => {
    const filtro = req.query.filtro?.toLowerCase();

    try {
        let personas;
        switch (filtro) {
            case 'clientes':
                personas = await db.persona.findAll({
                    where: { idrol: 2 },
                    include: { model: db.rol }
                });
                break;
                case 'proveedor':
                personas = await db.persona.findAll({
                    where: { idrol: 5 },
                    include: { model: db.rol }
                });
                break;

            case 'personal':
                personas = await db.persona.findAll({
                    where: {
                        idrol: [3, 4]
                    },
                    include: { model: db.rol }
                });
                break;

            case 'activos':
                personas = await db.persona.findAll({
                    where: { estado: 1 },
                    include: {
                       model: db.rol,
                        where: {
                           idrol: { [Op.in]: [2,3,4,5] }
                               }
                          }
                });
                break;

            case 'bloqueados':
                personas = await db.persona.findAll({
                    where: { estado: 0 },
                   include: {
                       model: db.rol,
                        where: {
                           idrol: { [Op.in]: [2,3,4,5] }
                               }
                          }
                });
                break;

            case 'todos':
            default:
                personas = await db.persona.findAll({
                    include: {
                       model: db.rol,
                        where: {
                           idrol: { [Op.in]: [2,3,4,5] }
                               }
                          }
                });
                break;
        }

        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al listar personas' });
    }
};

// POST: Registrar persona
const registrarPersona = async (req, res) => {
    try {
        req.body.idrol = req.body.rol?.idrol;
        const persona = await db.persona.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};
const GuardarFotografia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ninguna imagen' });
    }
    res.status(200).json({ nombre: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir imagen' });
  }
};
// PUT: Modificar persona
const modificarPersona = async (req, res) => {
    const id = req.params.id;
    try {
        req.body.idrol = req.body.rol?.idrol;
        await db.persona.update(req.body, { where: { idpersona: id } });
        res.status(200).json({ mensaje: 'Persona modificada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al modificar persona' });
    }
};

// GET: Buscar personas por filtro
const buscarPersonas = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const personas = await db.persona.findAll({
            include: {model: db.rol},
            where: {
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${filtro}%` } },      // PostgreSQL: insensible a mayúsculas
                    { ap_paterno: { [Op.iLike]: `%${filtro}%` } }  // también buscar en ap_paterno
                ]
            }
        });
        res.json(personas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar personas' });
    }
};

// PUT: Cambiar estado de persona
const cambiarEstadoPersona = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const nuevoEstado = estado === 0 ? 1 : 0;
        await db.persona.update({ estado: nuevoEstado }, { where: { idpersona: id } });
        res.status(200).json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado' });
    }
};

const verDetallesPersona = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la persona y su credencial (si existe)
        const persona = await db.persona.findOne({
            where: { idpersona: id },
            include: [
                { model: db.rol }, // si quieres incluir el rol también
                { model: db.credencial, required: false } // unión opcional
            ]
        });

        if (!persona) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }

        return res.json(persona);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al obtener detalles de la persona' });
    }
};

module.exports = {verDetallesPersona, listarPersonas, listarPersonasFiltradas, buscarPersonas, registrarPersona, modificarPersona, cambiarEstadoPersona, GuardarFotografia, GenerarReportePersona}