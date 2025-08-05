const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('negocio', {
    idnegocio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nit: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    razon_social: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    persona_registrado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    idpersona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persona',
        key: 'idpersona'
      }
    },
    idciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudad',
        key: 'idciudad'
      }
    }
  }, {
    sequelize,
    tableName: 'negocio',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "negocio_pkey",
        unique: true,
        fields: [
          { name: "idnegocio" },
        ]
      },
    ]
  });
};
