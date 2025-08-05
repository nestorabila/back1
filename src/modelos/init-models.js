var DataTypes = require("sequelize").DataTypes;
var _catalogo = require("./catalogo");
var _categoria = require("./categoria");
var _ciudad = require("./ciudad");
var _compra = require("./compra");
var _credencial = require("./credencial");
var _departamento = require("./departamento");
var _detalle_compra = require("./detalle_compra");
var _detalle_pedido = require("./detalle_pedido");
var _empaque = require("./empaque");
var _negocio = require("./negocio");
var _pedido = require("./pedido");
var _persona = require("./persona");
var _producto = require("./producto");
var _proveedor = require("./proveedor");
var _rol = require("./rol");
var _sistema = require("./sistema");

function initModels(sequelize) {
  var catalogo = _catalogo(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var ciudad = _ciudad(sequelize, DataTypes);
  var compra = _compra(sequelize, DataTypes);
  var credencial = _credencial(sequelize, DataTypes);
  var departamento = _departamento(sequelize, DataTypes);
  var detalle_compra = _detalle_compra(sequelize, DataTypes);
  var detalle_pedido = _detalle_pedido(sequelize, DataTypes);
  var empaque = _empaque(sequelize, DataTypes);
  var negocio = _negocio(sequelize, DataTypes);
  var pedido = _pedido(sequelize, DataTypes);
  var persona = _persona(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var proveedor = _proveedor(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var sistema = _sistema(sequelize, DataTypes);

  sistema.belongsTo(ciudad, { foreignKey: "idciudad"});
  ciudad.hasOne(sistema, { foreignKey: "idciudad"});

  detalle_pedido.belongsTo(catalogo, { foreignKey: "idcatalogo"});
  catalogo.hasMany(detalle_pedido, {  foreignKey: "idcatalogo"});
  catalogo.belongsTo(categoria, {  foreignKey: "idcategoria",as: "categoria"});
  categoria.hasMany(catalogo, {foreignKey: "idcategoria"});
  producto.belongsTo(categoria, {  foreignKey: "idcategoria", as: "categoria"});
  categoria.hasMany(producto, { foreignKey: "idcategoria"});
  negocio.belongsTo(ciudad, {  foreignKey: "idciudad"});
  ciudad.hasMany(negocio, {  foreignKey: "idciudad"});
  proveedor.belongsTo(ciudad, { foreignKey: "idciudad"});
  ciudad.hasMany(proveedor, { foreignKey: "idciudad"});
  detalle_compra.belongsTo(compra, {  foreignKey: "idcompra"});
  compra.hasMany(detalle_compra, { foreignKey: "idcompra"});
  ciudad.belongsTo(departamento, { foreignKey: "iddep"});
  departamento.hasMany(ciudad, {  foreignKey: "iddep"});
  detalle_compra.belongsTo(empaque, {  foreignKey: "idempaque"});
  empaque.hasMany(detalle_compra, {  foreignKey: "idempaque"});
  pedido.belongsTo(negocio, {  foreignKey: "idnegocio"});
  negocio.hasMany(pedido, { foreignKey: "idnegocio"});
  detalle_pedido.belongsTo(pedido, {  foreignKey: "idpedido"});
  pedido.hasMany(detalle_pedido, {  foreignKey: "idpedido"});
  credencial.belongsTo(persona, { foreignKey: "idpersona"});
  persona.hasOne(credencial, { foreignKey: "idpersona"});
  negocio.belongsTo(persona, { foreignKey: "idpersona"});
  persona.hasMany(negocio, {  foreignKey: "idpersona"});
  proveedor.belongsTo(persona, {  foreignKey: "idpersona"});
  persona.hasOne(proveedor, {  foreignKey: "idpersona"});
  detalle_compra.belongsTo(producto, { foreignKey: "idproducto"});
  producto.hasMany(detalle_compra, { foreignKey: "idproducto"});
  compra.belongsTo(proveedor, {  foreignKey: "idproveedor"});
  proveedor.hasMany(compra, {  foreignKey: "idproveedor"});
  persona.belongsTo(rol, { foreignKey: "idrol"});
  rol.hasMany(persona, { foreignKey: "idrol"});

  return {
    catalogo,
    categoria,
    ciudad,
    compra,
    credencial,
    departamento,
    detalle_compra,
    detalle_pedido,
    empaque,
    negocio,
    pedido,
    persona,
    producto,
    proveedor,
    rol,
    sistema,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
