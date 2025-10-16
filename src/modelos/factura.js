const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factura', {
    idfactura: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cuf: {
      type: DataTypes.STRING(255),
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
    persona_registrado: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    idpedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedido',
        key: 'idpedido'
      }
    },
    idmetodo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'metodo_pago',
        key: 'idmetodo'
      }
    },
    idpuntoventa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'punto_venta',
        key: 'idpuntoventa'
      }
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'factura',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "factura_pkey",
        unique: true,
        fields: [
          { name: "idfactura" },
        ]
      },
    ]
  });
};
