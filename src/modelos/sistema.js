const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sistema', {
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nit: {
      type: DataTypes.STRING(40),
      allowNull: false
    },

     telefono: {
      type: DataTypes.STRING(40),
      allowNull: false
    },

     direccion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    long: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    lat: {
      type: DataTypes.DECIMAL(11, 8), 
      allowNull: true
    },

    idciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudad',
        key: 'idciudad'
      },
      unique: "sistema_idciudad_key"
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
