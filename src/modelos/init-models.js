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
var _factura = require("./factura");
var _genero = require("./genero");
var _metodo_pago = require("./metodo_pago");
var _negocio = require("./negocio");
var _pedido = require("./pedido");
var _persona = require("./persona");
var _producto = require("./producto");
var _proveedor = require("./proveedor");
var _punto_venta = require("./punto_venta");
var _rol = require("./rol");
var _rol_persona = require("./rol_persona");
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
  var factura = _factura(sequelize, DataTypes);
  var genero = _genero(sequelize, DataTypes);
  var metodo_pago = _metodo_pago(sequelize, DataTypes);
  var negocio = _negocio(sequelize, DataTypes);
  var pedido = _pedido(sequelize, DataTypes);
  var persona = _persona(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var proveedor = _proveedor(sequelize, DataTypes);
  var punto_venta = _punto_venta(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var rol_persona = _rol_persona(sequelize, DataTypes);
  var sistema = _sistema(sequelize, DataTypes);

  persona.belongsToMany(rol, {  through: rol_persona, foreignKey: "idpersona", otherKey: "idrol", as: 'rol' });
  rol.belongsToMany(persona, {  through: rol_persona, foreignKey: "idrol", otherKey: "idpersona" });
  detalle_pedido.belongsTo(catalogo, {  foreignKey: "idcatalogo"});
  catalogo.hasMany(detalle_pedido, {  foreignKey: "idcatalogo"});
  catalogo.belongsTo(categoria, { foreignKey: "idcategoria", as: "categoria"});
  categoria.hasMany(catalogo, {  foreignKey: "idcategoria"});
  producto.belongsTo(categoria, { foreignKey: "idcategoria",as: "categoria"});
  categoria.hasMany(producto, { foreignKey: "idcategoria"});
  negocio.belongsTo(ciudad, { foreignKey: "idciudad"});
  ciudad.hasMany(negocio, {  foreignKey: "idciudad"});
  proveedor.belongsTo(ciudad, {  foreignKey: "idciudad"});
  ciudad.hasMany(proveedor, {  foreignKey: "idciudad"});
  sistema.belongsTo(ciudad, {  foreignKey: "idciudad"});
  ciudad.hasOne(sistema, { foreignKey: "idciudad"});
  detalle_compra.belongsTo(compra, {  foreignKey: "idcompra"});
  compra.hasMany(detalle_compra, {  foreignKey: "idcompra"});
  ciudad.belongsTo(departamento, {  foreignKey: "iddep"});
  departamento.hasMany(ciudad, { foreignKey: "iddep"});
  detalle_compra.belongsTo(empaque, {  foreignKey: "idempaque"});
  empaque.hasMany(detalle_compra, {  foreignKey: "idempaque"});
  persona.belongsTo(genero, {  foreignKey: "idgenero"});
  genero.hasMany(persona, {  foreignKey: "idgenero"});
  factura.belongsTo(metodo_pago, { foreignKey: "idmetodo"});
  metodo_pago.hasMany(factura, {  foreignKey: "idmetodo"});
  pedido.belongsTo(negocio, {  foreignKey: "idnegocio"});
  negocio.hasMany(pedido, {  foreignKey: "idnegocio"});
  detalle_pedido.belongsTo(pedido, {  foreignKey: "idpedido"});
  pedido.hasMany(detalle_pedido, {  foreignKey: "idpedido"});
  factura.belongsTo(pedido, {foreignKey: "idpedido"});
  pedido.hasMany(factura, { foreignKey: "idpedido"});
  credencial.belongsTo(persona, {  foreignKey: "idpersona"});
  persona.hasOne(credencial, { foreignKey: "idpersona"});
  negocio.belongsTo(persona, {  foreignKey: "idpersona"});
  persona.hasMany(negocio, {  foreignKey: "idpersona"});
  proveedor.belongsTo(persona, {  foreignKey: "idpersona"});
  persona.hasOne(proveedor, {  foreignKey: "idpersona"});
  rol_persona.belongsTo(persona, {  foreignKey: "idpersona"});
  persona.hasMany(rol_persona, {  foreignKey: "idpersona"});
  detalle_compra.belongsTo(producto, {  foreignKey: "idproducto"});
  producto.hasOne(detalle_compra, {  foreignKey: "idproducto"});
  compra.belongsTo(proveedor, { foreignKey: "idproveedor"});
  proveedor.hasMany(compra, {  foreignKey: "idproveedor"});
  factura.belongsTo(punto_venta, {  foreignKey: "idpuntoventa", as:'punto_venta'});
  punto_venta.hasMany(factura, {  foreignKey: "idpuntoventa"});
  rol_persona.belongsTo(rol, {  foreignKey: "idrol"});
  rol.hasMany(rol_persona, { foreignKey: "idrol"});
  punto_venta.belongsTo(sistema, {  foreignKey: "idsistema"});
  sistema.hasMany(punto_venta, { foreignKey: "idsistema"});

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
    factura,
    genero,
    metodo_pago,
    negocio,
    pedido,
    persona,
    producto,
    proveedor,
    punto_venta,
    rol,
    rol_persona,
    sistema,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
