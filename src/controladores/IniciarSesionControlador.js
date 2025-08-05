const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { db } = require('../config/database'); 
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'secreto123';

const loguear = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  try {
    // Buscar la credencial con la persona y rol relacionados
    const credencial = await db.credencial.findOne({
      where: { usuario },
      include: [
        {
          model: db.persona,
          as: 'persona',
          include: [{ model: db.rol, as: 'rol' }]
        }
      ]
    });

    if (!credencial) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const contrasenaValida = await bcrypt.compare(contrasena, credencial.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { idpersona: credencial.idpersona, usuario: credencial.usuario },
      SECRET_KEY,
      { expiresIn: '30m' }
    );

    // Extraer nombre de persona y nombre del rol
    const nombreCompleto = credencial.persona.nombre + " " + credencial.persona.ap_paterno;
    const correo = credencial.persona.correo;
    const estado = credencial.persona.estado;
    const idpersona = credencial.persona.idpersona;
    const nombreRol = credencial.persona.rol.nombre;

    res.json({
      usuario: credencial.usuario,
      token,
      correo: correo,
      nombreCompleto: nombreCompleto,
      rol: nombreRol,
      estado: estado,
      idpersona: idpersona
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { loguear };
