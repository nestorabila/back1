const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('punto_venta', {
    idpuntoventa: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sistema',
        key: 'idsistema'
      }
    },
    descripcion: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'punto_venta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "punto_venta_pkey",
        unique: true,
        fields: [
          { name: "idpuntoventa" },
        ]
      },
    ]
  });
};
