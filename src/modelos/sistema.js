const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sistema', {
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    idciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudad',
        key: 'idciudad'
      },
      unique: "sistema_idciudad_key"
    },
    long: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sistema',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sistema_idciudad_key",
        unique: true,
        fields: [
          { name: "idciudad" },
        ]
      },
      {
        name: "sistema_pkey",
        unique: true,
        fields: [
          { name: "idsistema" },
        ]
      },
    ]
  });
};
