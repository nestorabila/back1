const { db } = require("../config/database");
const rol = require("../modelos/rol");
const { Op } = require('sequelize');
const axios = require('axios');
const soap = require('soap');
const crypto = require('crypto');
const { create } = require('xmlbuilder2');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');


const num = require("numero-a-letras");
console.log(num);


const listarFactura = async (req, res) => {
  try {
    const lista = await db.factura.findAll({
      include: [
        {
          model: db.pedido,
          include: [
            {
              model: db.detalle_pedido, // incluir los detalles
              attributes: ['precio_subtotal']
            },
            {
              model: db.negocio,
              include: [{ model: db.persona }]
            }
          ]
        },
        { model: db.punto_venta, as: 'punto_venta' },
        { model: db.metodo_pago }
      ]
    });

    // Agregar precio_total a cada factura
    const listaConTotal = lista.map(f => {
      const detalles = f.pedido.detalle_pedidos || [];
      const precio_total = detalles.reduce((sum, d) => sum + Number(d.precio_subtotal), 0);
      return { ...f.toJSON(), precio_total };
    });

    return res.json(listaConTotal);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al listar facturas' });
  }
};

const GenerarReporteFactura = async (req, res) => {
  try {
    const { rol, nombre, estado, fechaDesde, fechaHasta } = req.query;

    const filtros = {
      where: {},
      include: [
        {
          model: db.pedido,
          include: [
            {
              model: db.detalle_pedido,
              attributes: ['precio_subtotal']
            },
            {
              model: db.negocio,
              include: [{ model: db.persona }]
            }
          ]
        },
        { model: db.punto_venta, as: 'punto_venta' },
        { model: db.metodo_pago }
      ]
    };

    // Filtros
    if (rol) filtros.where.idmetodo = rol;
    if (estado) filtros.where.estado = estado;
    if (nombre) {
      filtros.where[Op.or] = [
        { '$pedido.negocio.persona.nombre$': { [Op.iLike]: `%${nombre}%` } },
        { '$pedido.negocio.persona.ap_paterno$': { [Op.iLike]: `%${nombre}%` } },
        { '$pedido.negocio.persona.ap_materno$': { [Op.iLike]: `%${nombre}%` } }
      ];
    }
    if (fechaDesde && fechaHasta) {
      filtros.where.fecha = { [Op.between]: [fechaDesde, fechaHasta] };
    } else if (fechaDesde) {
      filtros.where.fecha = { [Op.gte]: fechaDesde };
    } else if (fechaHasta) {
      filtros.where.fecha = { [Op.lte]: fechaHasta };
    }

    // Buscar facturas (no personas)
    const lista = await db.factura.findAll(filtros);

    // Agregar precio_total a cada factura
    const listaConTotal = lista.map(f => {
      const detalles = f.pedido.detalle_pedidos || [];
      const precio_total = detalles.reduce((sum, d) => sum + Number(d.precio_subtotal), 0);
      return { ...f.toJSON(), precio_total };
    });

    return res.json(listaConTotal);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al generar reporte de facturas' });
  }
};

const buscarFactura = async (req, res) => {
    const filtro = req.query.filtro || '';
    try {
        const facturas = await db.factura.findAll({
            include: [
                {
                    model: db.pedido,
                    include: [
                        {
                            model: db.negocio,
                            include: [
                                {
                                    model: db.persona
                                }
                            ]
                        },
                        {
                            model: db.detalle_pedido,
                            attributes: ['precio_subtotal']
                        }
                    ]
                },
                { model: db.punto_venta, as: 'punto_venta' },
                { model: db.metodo_pago }
            ],
            where: {
                [Op.or]: [
                    { '$pedido.negocio.persona.nombre$': { [Op.iLike]: `%${filtro}%` } },
                    { '$pedido.negocio.persona.ap_paterno$': { [Op.iLike]: `%${filtro}%` } },
                    { '$pedido.negocio.persona.ap_materno$': { [Op.iLike]: `%${filtro}%` } }
                ]
            }
        });

        // Agregar precio_total a cada factura
        const listaConTotal = facturas.map(f => {
            const detalles = f.pedido.detalle_pedidos || [];
            const precio_total = detalles.reduce((sum, d) => sum + Number(d.precio_subtotal), 0);
            return { ...f.toJSON(), precio_total };
        });

        res.json(listaConTotal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar facturas' });
    }
};


const anularFactura = async (req, res) => {
    const id = req.params.xcod; // id de la factura
    try {
        // Usamos db.factura en vez de factura
        const facturaEncontrada = await db.factura.findByPk(id);

        if (!facturaEncontrada) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }

        // Cambiamos estado a 0
        facturaEncontrada.estado = 0;
        await facturaEncontrada.save();

        res.json({ mensaje: 'Factura anulada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al anular la factura' });
    }
};


const generarPDFFactura = async (factura) => {
    const carpeta = path.join(__dirname, '..', 'facturas_xml');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

    const pedido = await factura.getPedido({ 
         include: [
            { 
                model: factura.sequelize.models.negocio, 
                include: ['persona', factura.sequelize.models.ciudad] 
            },
            { 
                model: factura.sequelize.models.detalle_pedido, 
                include: [factura.sequelize.models.catalogo] 
            },
        ]
    
    });
    const puntoVenta = await factura.getPunto_venta({ 
  include: [ factura.sequelize.models.sistema ] 
});
    const negocio = pedido.negocio;
    const cliente = negocio.persona;
    const ciudad = negocio.ciudad
    const sistema = puntoVenta.sistema;
    const detalles = pedido.detalle_pedidos || [];

    const nombreArchivoPDF = `factura_${factura.idfactura}.pdf`;
    const rutaArchivoPDF = path.join(carpeta, nombreArchivoPDF);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(fs.createWriteStream(rutaArchivoPDF));

    const colorTexto = 'black';  // ahora todo negro
    const yEncabezado = 50;

    // ===== Encabezado: 3 columnas =====
    const xIzquierda = 50;
    const xCentro = 200;
    const xDerecha = 400;

    // Columna izquierda: Casa matriz
    doc.fontSize(8).fillColor(colorTexto);
    doc.text('CASA MATRIZ', xIzquierda, yEncabezado);
    doc.text('No Punto de venta 1', xIzquierda, yEncabezado + 12);
    doc.text(`${sistema.direccion}`, xIzquierda, yEncabezado + 24);
    doc.text(`Teléfono: ${sistema.telefono}`, xIzquierda, yEncabezado + 36);
    doc.text('Tarija - Bolivia', xIzquierda, yEncabezado + 48);

    // Columna central: Título centrado
    doc.fillColor(colorTexto).fontSize(10).text('FACTURA', xCentro, yEncabezado + 57, {
        width: 150,
        align: 'center',
        underline: true
    });
    doc.fontSize(7).text('(con derecho a crédito fiscal)', xCentro, yEncabezado + 71, {
        width: 150,
        align: 'center'
    });

    // Columna derecha: NIT, Factura y CUF
    const xEtiqueta = xDerecha;
    const xValor = xDerecha + 100;
    let yInicio = yEncabezado;

    doc.fontSize(8).fillColor(colorTexto);
    doc.text('NIT:', xEtiqueta, yInicio);
    doc.text('FACTURA no:', xEtiqueta, yInicio + 12);
    doc.text('COD.AUTORIZACION:', xEtiqueta, yInicio + 24);

    doc.fillColor(colorTexto);
    doc.text(`${sistema.nit}`, xValor, yInicio);
    doc.text(`${factura.idfactura}`, xValor, yInicio + 12);

    const cuf = factura.cuf.replace(/[\r\n]+/g, '').trim();
    doc.text(cuf, xValor, yInicio + 24);

    // ===== Datos del Cliente y del Negocio en 3 columnas =====
const yDatosCliente = yEncabezado + 90;

// Columnas
const xCol1 = 50;   // izquierda
const xCol2 = 220;  // centro
const xCol3 = 390;  // derecha
const espacioFila1 = 12; // espacio vertical más compacto

doc.fontSize(8).fillColor(colorTexto);

// Columna 1: Cliente
doc.text(`Cód. Cliente: ${cliente.idpersona}`, xCol1, yDatosCliente);

// Fecha al lado derecho del código del cliente
const anchoCodigo = doc.widthOfString(`Cód. Cliente: ${cliente.idpersona}`) + 10; 
doc.text(`Fecha: ${cliente.fecha} ${cliente.hora}`, xCol1 + anchoCodigo, yDatosCliente);

doc.text(`Nombre: ${cliente.nombre} ${cliente.ap_paterno} ${cliente.ap_materno || ''}`, xCol1, yDatosCliente + espacioFila1);
doc.text(`NIT/CI/CEX: ${cliente.cedula}`, xCol1, yDatosCliente + 2 * espacioFila1);

// Columna 2: Teléfono y negocio
doc.text(`Teléfono: ${cliente.telefono} - ${negocio.telefono}`, xCol2, yDatosCliente);
doc.text(`Cod.RZ: ${negocio.idnegocio}`, xCol2, yDatosCliente + espacioFila1);
doc.text(`Razón Social: ${negocio.razon_social}`, xCol2, yDatosCliente + 2 * espacioFila1);

// Columna 3: Dirección y ciudad
doc.text(`Dirección: ${negocio.direccion} - ${ciudad.nombre || ''}`, xCol3, yDatosCliente);


 // ===== tabla de productos vendidos =====
    const yTabla = yEncabezado + 130;
    const xNro = 50;
    const xNombre = 80;
    const xCantidad = 250;
    const xPrecioU = 300;
    const xDescuento = 360;
    const xSubTotal = 420;
    const espacioFila = 20;

    // Encabezado tabla
    doc.fontSize(8).fillColor(colorTexto)
       .text('Nro', xNro, yTabla)
       .text('Nombre', xNombre, yTabla)
       .text('Cantidad', xCantidad, yTabla)
       .text('Precio U', xPrecioU, yTabla)
       .text('Descuento', xDescuento, yTabla)
       .text('Sub Total', xSubTotal, yTabla);

    doc.moveTo(xNro, yTabla + 12).lineTo(xSubTotal + 60, yTabla + 12).stroke();

    // 🔹 Dibujamos los productos reales
    let yFila = yTabla + 20;
    let nro = 1;
    let subtotal = 0;
    let descuentoTotal = 0;

    for (const det of detalles) {
        const producto = det.catalogo;
        const cantidad = det.cantidad;
        const precioUnit = producto.precio;
        const desc = 0; // si tienes descuento en tu BD, lo pones aquí
        const sub = cantidad * precioUnit - desc;

        // Pintar fila
        doc.text(nro, xNro, yFila);
        doc.text(producto.nombre, xNombre, yFila);
        doc.text(cantidad.toString(), xCantidad, yFila);
        doc.text(precioUnit.toFixed(2), xPrecioU, yFila);
        doc.text(desc.toFixed(2), xDescuento, yFila);
        doc.text(sub.toFixed(2), xSubTotal, yFila);

        subtotal += cantidad * precioUnit;
        descuentoTotal += desc;

        nro++;
        yFila += espacioFila;
    }

    // ===== Totales debajo de la tabla =====
    const yTotales = yFila + 10;
    const xLabel = 300;
    const xValue = 420;

    const total = subtotal - descuentoTotal;
    const tasas = 0;
    const montoPagar = total - tasas;

    doc.text('Subtotal Bs:.', xLabel, yTotales);
    doc.text(subtotal.toFixed(2), xValue, yTotales);

    doc.text('Descuento Bs.:', xLabel, yTotales + 15);
    doc.text(descuentoTotal.toFixed(2), xValue, yTotales + 15);

    doc.text('Total Bs:.', xLabel, yTotales + 30);
    doc.text(total.toFixed(2), xValue, yTotales + 30);

    doc.text('(-) Tasas Bs:', xLabel, yTotales + 45);
    doc.text(tasas.toFixed(2), xValue, yTotales + 45);

    doc.text('Monto a Pagar Bs.:', xLabel, yTotales + 60);
    doc.text(montoPagar.toFixed(2), xValue, yTotales + 60);

    doc.text('Importe Base Crédito Fiscal:', xLabel, yTotales + 75);
    doc.text(total.toFixed(2), xValue, yTotales + 75);

    // precio literal
 const yLiteral = yTotales + 100;
let montoLiteral = num.NumerosALetras(montoPagar);
montoLiteral = montoLiteral.replace(/Pesos/gi, 'Bolivianos');

doc.fontSize(8).text(`Son: ${montoLiteral}`, xNro, yLiteral);

 // Posición debajo del monto literal
const ySimulado = yLiteral + 25; // ajusta según espacio disponible
const fechaActual = new Date();

// Primer párrafo: mensaje legal / advertencia
const mensajeLegal = `Esta factura contribuye al desarrollo económico del país y su uso ilícito será sancionado penalmente de acuerdo a la Ley Nº 435. 
Está prohibida la reproducción, distribución o comercialización de esta factura sin autorización. 
Cualquier intento de alterar, copiar o distribuir esta factura constituirá un delito según la normativa vigente.`;

// Segundo párrafo: información de la transacción en una sola línea
const mensajeTransaccion = `Fecha: ${fechaActual.toLocaleDateString()} | Hora: ${fechaActual.toLocaleTimeString()} | Tipo de pago: efectivo | Generado LuciWeb | (FACTURA SIMULADA)`;

// Definir coordenadas del QR (lado izquierdo)
const xQR = 50; // margen izquierdo
const yQR = ySimulado - 13;

// Generar QR simulado
const qrData = `Factura simulada - LuciWeb - ID Factura: ${factura.idfactura}`;
const qrBuffer = await QRCode.toBuffer(qrData, { type: 'png', errorCorrectionLevel: 'H' });
doc.image(qrBuffer, xQR, yQR, { width: 100, height: 100 });

// Definir coordenadas para los textos (lado derecho del QR)
const xTexto = xQR + 120; // deja espacio entre QR y texto
const yTexto = ySimulado;

// Agregar primer párrafo al PDF (lado derecho del QR)
doc.fontSize(8)
   .fillColor('black')
   .text(mensajeLegal, xTexto, yTexto, { width: 500, lineGap: 2 });

// Ajustar posición vertical para el segundo párrafo
const yTransaccion = yTexto + 50; // ajusta según altura del primer párrafo
doc.fontSize(8)
   .fillColor('gray')
   .text(mensajeTransaccion, xTexto, yTransaccion, { width: 500, lineGap: 2 });

// aqui debe terminad pie de pagina
    doc.end();
    return rutaArchivoPDF;
};





const generarCUF = (longitud = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Letras y números
    let result = '';
    for (let i = 0; i < longitud; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// POST: Registrar persona
const registrarFactura = async (req, res) => {
    try {
         req.body.idpedido = req.body.pedido?.idpedido;
          req.body.idpuntoventa = req.body.punto_venta?.idpuntoventa;
           req.body.idmetodo = req.body.metodo_pago?.idmetodo;
           req.body.cuf = generarCUF();
        const categoria = await db.factura.create(req.body);
         if (req.body.idpedido) {
            const pedido = await db.pedido.findByPk(req.body.idpedido);
            if (pedido && pedido.estado === 3) {
                pedido.estado = 4;
                await pedido.save();
            }
        }
         const rutaPDF = await generarPDFFactura(categoria);
        res.status(201).json({categoria, rutaPDF});
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar persona' });
    }
};


module.exports = { listarFactura, GenerarReporteFactura, registrarFactura, anularFactura, buscarFactura};


