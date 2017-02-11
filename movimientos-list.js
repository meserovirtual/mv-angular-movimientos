(function () {
    angular.module('mvMovimientosList', [])
        .service('MovimientosList', MovimientosList);

    //1 Código de Usuario
    //2 Detalle
    //3 Código de Cliente
    //4 Código de Ocupación
    //5 Código de Moneda
    //6 Cotizacion
    //7 Monto en Moneda
    //8 Código de Producto
    //9 Precio por Unidad
    //10 Tipo de Tarjeta
    //11 Costo
    //12 Sucursal
    //13 Cantidad
    //14 Codigo de Proveedor

    function MovimientosList() {
        this.cajaGeneral = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.10', // Movimiento de caja
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.cajaGeneralSucursal = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.3' + sucursal_id, // Movimiento de caja
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.cajaChica = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.0' + sucursal_id, // Venta / Pago
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            };
        };

        this.cobroTarjeta = function (sucursal_id, pos_id, importe, comentario, tarjeta, usuario_id) {
            return {
                cuenta_id: '1.1.4.01', // Cobro con tarjeta
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '10', /* Tipo Tarjeta TC TD*/ 'valor': tarjeta},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor': sucursal_id}]
            };
        };

        this.tarjetasAPagar = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '2.1.2.01', // Tarjetas a pagar
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            };
        };

        this.sueldos = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '5.2.1.01', // Sueldos pagados
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            };
        };

        this.ventaMercaderias = function (sucursal_id, pos_id, producto_id, precio_unidad, cantidad, precio_total, comentario, usuario_id) {
            return {
                cuenta_id: '4.1.1.01', // venta de mercaderias
                importe: precio_total,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio por Unidad*/ 'valor': precio_unidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor': sucursal_id}
                ]
            };
        };

        this.ivaVentas = function (sucursal_id, pos_id, producto_id, precio_unidad, cantidad, precio_total, comentario, usuario_id) {
            return {
                cuenta_id: '2.1.4.09', // venta de mercaderias
                importe: precio_total,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor': sucursal_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id}
                ]
            };
        };

        this.ventaServicio = function (sucursal_id, pos_id, importe, comentario, cliente_id, usuario_id) {
            return {
                cuenta_id: '4.1.1.02', // venta de servicios
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '3', /* cliente_id*/ 'valor': cliente_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor': sucursal_id}
                ]
            };
        };

        this.insumos = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.5.01', // Insumos
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.aguinaldos = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '5.2.1.02', // Aguinaldos
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.bancoCC = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.21', // CC
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': 'CC: ' +  comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.bancoCA = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.22', // CA
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': 'CA: ' +  comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.bancoMonedaExtranjera = function (sucursal_id, pos_id, importe, comentario, moneda_id, cotizacion, monto_moneda, usuario_id) {
            return {
                cuenta_id: '1.1.1.23', // Moneda extranjera
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '5', /* moneda_id*/ 'valor': moneda_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '6', /* cotizacion*/ 'valor': cotizacion},
                    {'movimiento_id': -1, 'detalle_tipo_id': '7', /* monto_moneda*/ 'valor': monto_moneda},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.cmv = function (sucursal_id, pos_id, costo, comentario, producto_id, cantidad, usuario_id) {
            if(usuario_id == undefined || usuario_id == ''){
                usuario_id = 1;
            }
            return {
                cuenta_id: '5.1.1.01', // CMV
                importe: costo * cantidad,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.bienesDeUso = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.2.1.01', // Bienes de Uso
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.bienesDeUso = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.2.1.01', // Bienes de Uso
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.mercaderias = function (sucursal_id, pos_id, costo, comentario, producto_id, cantidad, proveedor_id, usuario_id) {
            return {
                cuenta_id: '1.1.7.01', // Mercaderias
                importe: costo * cantidad,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '14', /* Código de Proveedor*/ 'valor': proveedor_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };


        this.desperdicios = function (sucursal_id, pos_id, costo, comentario, producto_id, cantidad, proveedor_id, usuario_id) {
            return {
                cuenta_id: '5.2.7.02', // Mercaderias
                importe: costo * cantidad,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '14', /* Código de Proveedor*/ 'valor': proveedor_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };


        this.productos_en_proceso = function (sucursal_id, pos_id, costo, comentario, producto_id, cantidad, proveedor_id, usuario_id) {
            return {
                cuenta_id: '1.1.7.02', // Productos en proceso
                importe: costo * cantidad,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '14', /* Código de Proveedor*/ 'valor': proveedor_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}
                ]
            };
        };

        this.descuentos = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '4.1.4.01', // Descuentos otorgados
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.interesesComisiones = function (sucursal_id, pos_id, importe, comentario, tipo_id, usuario_id) {
            //01 - GASTO INTERESES
            //02 - MANTENIMIENTO DE CUENTAS
            //03 - COMISIONES POR VENTAS CON TARJETA

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.8.' + tipo_id, // Intereses y Comisiones
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.impuestosGenerales = function (sucursal_id, pos_id, importe, comentario, tipo_id, usuario_id) {
            //5.2.4.01	AGUA
            //5.2.4.02	LUZ
            //5.2.4.03	TELEFONOS Y FAX
            //5.2.4.04	INTERNET
            //5.2.4.05	ALQUILERES
            //5.2.4.06	EXPENSAS

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.4.' + tipo_id, // Impuestos y gastos generales
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.otrosImpuestos = function (sucursal_id, pos_id, importe, comentario, tipo_id, usuario_id) {
            //5.2.5.01	IMPUESTOS FISCALES Y MUNICIP.
            //5.2.5.02	MONOTRIBUTO SOCIEDAD
            //5.2.5.03	MONOTRIBUTO PERSONAL
            //5.2.5.04	IDB
            //5.2.5.05	SADAIC
            //5.2.5.06	PERCEPCION GANANCIAS
            //5.2.5.07	PERCEPCION IIBB

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.5.' + tipo_id, // Otros Impuestos
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.interesesGanados = function (sucursal_id, pos_id, importe, comentario, tipo_id, usuario_id) {
            //4.2.1.01	INTERESES GANADOS
            //4.2.1.02	INTERESES GANADOS CA
            //4.2.1.03	INTERESES GANADOS CA MONEDA EXTRANJERA
            //4.2.1.04	CREDITOS POR IDB
            //4.2.1.05	DEVOLUCIÓN IVA TD

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '4.2.1.' + tipo_id, // Otros Impuestos
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.publicidad = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.2.01', // publicidad
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.otrosGastos = function (sucursal_id, pos_id, importe, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.3.1.01', // Otros gastos
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id}]
            }
        };

        this.deudores = function (sucursal_id, pos_id, importe, cliente_id, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '1.1.2.01', // Deudores - Clientes
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '3', /* cliente_id*/ 'valor': cliente_id}
                ]
            }
        };

        this.proveedores = function (sucursal_id, pos_id, importe, cliente_id, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '2.1.1.01', // Deudores - Clientes
                'importe': importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '14', /* proveedor_id*/ 'valor': cliente_id}
                ]
            }
        };

        this.mercadoPago = function (sucursal_id, pos_id, importe,cliente_id, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.24', // Mercado Pago
                importe: importe,
                usuario_id: usuario_id,
                sucursal_id: sucursal_id,
                pos_id: pos_id,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '12', /* Sucursal */ 'valor':sucursal_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '3', /* cliente_id*/ 'valor': cliente_id}
                ]
            };
        };


    }

})();
