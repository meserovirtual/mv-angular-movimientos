/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    var app = angular.module('mvMovimientos', ['mvMovimientosList']);
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    if (currentScriptPath.length == 0) {
        currentScriptPath = window.installPath + '/mv-angular-movimientos/includes/ac-movimientos.php';
    }

    app.service('MovimientoStockFinal', [function () {
        this.stocks_finales = [];
    }]);

    app.factory('MovimientosService',
        ['$http', 'MovimientosList', 'MovimientoStockFinal',
            function ($http, MovimientosList, MovimientoStockFinal) {
                var vm = this;

                var url = currentScriptPath.replace('movimientos-service.js', '/includes/ac-movimientos.php');

                var service = {};

                service.armarMovimiento = armarMovimiento;
                service.getBy = getBy;
                service.get = get;
                service.save = save;
                service.getMaxAsiento = getMaxAsiento;
                service.deleteAsiento = deleteAsiento;

                function armarMovimiento(tipo_asiento, subtipo_asiento, sucursal_id, pos_id, forma_pago, transferencia_desde, total, descuento, detalle, items, cliente_id, usuario_id, comentario, callback) {



                    //Tipos:
                    //001 - Venta de productos
                    //002 - Compra de productos
                    //003 - Compra de insumos
                    //004 - Venta de Servicio
                    //005 - Cancelar TC
                    //006 - Compra Moneda Extranjera
                    //007 - Pago Sueldos
                    //008 - Pago Comisiones Bancarias
                    //009 - Pago Impuestos
                    //010 - Compra Bien de Uso
                    //011 - Intereses Ganados
                    //012 - Otros Gastos
                    //013 - Retiro caja chija
                    //014 - Otros Impuestos
                    //015 - Deudores
                    //016 - Fraccionado

                    // Esta variable hace que se convierta el valor en negativo en la caja, significa que sale un valor
                    var pagando = 1;


                    var asiento = [];
                    switch (tipo_asiento) {
                        case '001':
                            MovimientoStockFinal.stocks_finales = [];
                            for (var i = 0; i < items.length; i++) {

                                // Hago una venta discriminado el iva, si el producto tiene un iva mayor a 0
                                if (parseFloat(items[i].iva) > 0) {
                                    var iva = (parseFloat(items[i].precio_total) * parseFloat(items[i].iva)) / 100;
                                    var precio_sin_iva = parseFloat(items[i].precio_total) - iva;
                                    if (items[i].producto_tipo == 3) {
                                        asiento.push(MovimientosList.ventaServicio(sucursal_id, pos_id, items[i].importe, items[i].descripcion, cliente_id, usuario_id));
                                    } else {
                                        asiento.push(MovimientosList.ventaMercaderias(sucursal_id, pos_id, items[i].producto_id, items[i].precio_unidad, items[i].cantidad, precio_sin_iva, 'Venta de producto', usuario_id));
                                        asiento.push(MovimientosList.ivaVentas(sucursal_id, pos_id, items[i].producto_id, items[i].precio_unidad, items[i].cantidad, iva, 'IVA Venta de producto', usuario_id));
                                    }
                                } else {
                                    if (items[i].producto_tipo == 3) {
                                        asiento.push(MovimientosList.ventaServicio(sucursal_id, pos_id, items[i].importe, items[i].descripcion, cliente_id, usuario_id));
                                    } else {
                                        asiento.push(MovimientosList.ventaMercaderias(sucursal_id, pos_id, items[i].producto_id, items[i].precio_unidad, items[i].cantidad, items[i].precio_total, 'Venta de producto', usuario_id));

                                    }

                                }


                                //Obtiene los costos para los productos que conforman el kit o solo para el producto

                                if (items[i].productos_kit.length > 0) {
                                    for (var x = 0; x < items[i].productos_kit.length; x++) {
                                        items[i].productos_kit[x].stock = items[i].productos_kit[x].stocks;
                                        items[i].productos_kit[x].producto_id = items[i].productos_kit[x].producto_kit_id;
                                        //items[i].productos_kit[x].stock.push(items[i].productos_kit[x].stock_obj);
                                        getCosto(items[i].productos_kit[x], asiento, sucursal_id, pos_id, usuario_id);
                                    }
                                } else {
                                    if (items[i].producto_tipo != 3) {
                                        getCosto(items[i], asiento, sucursal_id, pos_id, usuario_id);
                                    }

                                }


                            }
                            //pagando = -1;

                            break;
                        case '002':
                            var list_items = items.pedidos_detalles;
                            for (var i = 0; i < list_items.length; i++) {
                                //(sucursal_id, costo, comentario, producto_id, cantidad, proveedor_id, usuario_id)
                                if (parseInt(list_items[i].producto_tipo) == 4) {
                                    asiento.push(MovimientosList.productos_en_proceso(sucursal_id, pos_id, list_items[i].precio_unidad, 'Compra de Productos en proceso', list_items[i].producto_id, list_items[i].cantidad, items.proveedor_id, usuario_id));
                                } else {
                                    asiento.push(MovimientosList.mercaderias(sucursal_id, pos_id, list_items[i].precio_unidad, 'Compra de Mercaderías', list_items[i].producto_id, list_items[i].cantidad, items.proveedor_id, usuario_id));
                                }
                            }
                            pagando = -1;
                            detalle = 'Compra de Mercaderías';

                            break;
                        case '003':
                            for (var i = 0; i < items.length; i++) {
                                asiento.push(MovimientosList.insumos(sucursal_id, pos_id, items[i].precio_unidad, 'Venta de Mercaderías', items[i].producto_id, items[i].cantidad));
                            }
                            pagando = -1;
                            detalle = 'Compra de Insumos';
                            break;
                        case '004':
                            for (var i = 0; i < items.length; i++) {
                                asiento.push(MovimientosList.ventaServicio(sucursal_id, pos_id, items[i].importe, items[i].descripcion, cliente_id, usuario_id));
                            }
                            //sucursal_id, pos_id, importe, comentario, cliente_id, usuario_id

                            break;
                        case '005':
                            asiento.push(MovimientosList.tarjetasAPagar(sucursal_id, pos_id, total, comentario, usuario_id));
                            pagando = -1;
                            break;
                        case '006': // El item contiene el monto en la moneda (monto_moneda), cotizacion, moneda_id
                            console.log('entra2');
                            break;
                        case '007':
                            if (subtipo_asiento == '01') {
                                asiento.push(MovimientosList.sueldos(sucursal_id, pos_id, total, comentario, usuario_id));
                                detalle = 'Pago de sueldos';
                            } else {
                                asiento.push(MovimientosList.aguinaldos(sucursal_id, pos_id, total, comentario, usuario_id));
                                detalle = 'Pago de aguinaldos';
                            }

                            pagando = -1;
                            break;
                        case '008':
                            //01 - GASTO INTERESES
                            //02 - MANTENIMIENTO DE CUENTAS
                            //03 - COMISIONES POR VENTAS CON TARJETA
                            asiento.push(MovimientosList.interesesComisiones(sucursal_id, pos_id, total, comentario, subtipo_asiento, usuario_id));
                            detalle = comentario;
                            pagando = -1;
                            break;
                        case '009':
                            //5.2.4.01	AGUA
                            //5.2.4.02	LUZ
                            //5.2.4.03	TELEFONOS Y FAX
                            //5.2.4.04	INTERNET
                            //5.2.4.05	ALQUILERES
                            //5.2.4.06	EXPENSAS
                            asiento.push(MovimientosList.impuestosGenerales(sucursal_id, pos_id, total, comentario, subtipo_asiento, usuario_id));
                            detalle = comentario;
                            pagando = -1;
                            break;
                        case '010':
                            console.log('entra2');
                            break;
                        case '011':
                            asiento.push(MovimientosList.interesesGanados(sucursal_id, pos_id, total, comentario, subtipo_asiento, usuario_id));
                            break;
                        case '012':
                            asiento.push(MovimientosList.otrosGastos(sucursal_id, pos_id, total, comentario, usuario_id));
                            detalle = comentario;
                            pagando = -1;
                            break;
                        case '014':
                            //5.2.5.01	IMPUESTOS FISCALES Y MUNICIP.
                            //5.2.5.02	MONOTRIBUTO SOCIEDAD
                            //5.2.5.03	MONOTRIBUTO PERSONAL
                            //5.2.5.04	IDB
                            //5.2.5.05	SADAIC
                            //5.2.5.06	PERCEPCION GANANCIAS
                            //5.2.5.07	PERCEPCION IIBB
                            asiento.push(MovimientosList.otrosImpuestos(sucursal_id, pos_id, total, comentario, subtipo_asiento, usuario_id));
                            detalle = comentario;
                            pagando = -1;
                            break;
                        case '015':
                            if (forma_pago == '01' ||
                                forma_pago == '02' ||
                                forma_pago == '03' ||
                                forma_pago == '04' ||
                                forma_pago == '05' ||
                                forma_pago == '06') {
                                pagando = -1;
                            }
                            asiento.push(MovimientosList.deudores(sucursal_id, pos_id, pagando * total, cliente_id, comentario, usuario_id));
                            pagando = 1;
                            break;
                        case '016':

                            var list_items = items;

                            for (var i = 0; i < list_items.length; i++) {
                                if (parseInt(list_items[i].producto_tipo) == 4) {
                                    asiento.push(MovimientosList.productos_en_proceso(sucursal_id, pos_id, (-1 * list_items[i].precio_unidad), 'Fraccionado de Productos en proceso', list_items[i].producto_id, list_items[i].cantidad, list_items[i].proveedor_id, usuario_id));
                                } else if (parseInt(list_items[i].producto_tipo) == -1) {
                                    asiento.push(MovimientosList.desperdicios(sucursal_id, pos_id, list_items[i].precio_unidad, 'Desperdicios', list_items[i].producto_id, list_items[i].cantidad, list_items[i].proveedor_id, usuario_id));
                                } else {

                                    asiento.push(MovimientosList.mercaderias(sucursal_id, pos_id, list_items[i].precio_unidad, 'Fraccionado de Mercaderías', list_items[i].producto_id, list_items[i].cantidad, list_items[i].proveedor_id, usuario_id));
                                }
                            }
                            break;
                    }

                    // Puedo enviar varias formas de pago en un array
                    if (forma_pago instanceof Array) {
                        for (var i = 0; i < forma_pago.length; i++) {

                            if (forma_pago[i].importe > 0) {
                                formas_pagos(forma_pago[i].forma_pago, sucursal_id, pos_id, forma_pago[i].importe, ((i != 0) ? 0 : descuento), detalle, usuario_id, cliente_id, pagando, comentario, asiento);
                            }

                        }
                    } else {
                        formas_pagos(forma_pago, sucursal_id, pos_id, total, descuento, detalle, usuario_id, cliente_id, pagando, comentario, asiento);

                        if (transferencia_desde !== '00') {
                            pagando = -1;
                            formas_pagos(transferencia_desde, sucursal_id, pos_id, total, descuento, detalle, usuario_id, cliente_id, pagando, comentario, asiento);
                        }
                    }


                    save(callback, asiento);

                    //console.log(asiento);
                    //console.log(MovimientoStockFinal.stocks_finales);

                }

                function formas_pagos(forma_pago, sucursal_id, pos_id, total, descuento, detalle, usuario_id, cliente_id, pagando, comentario, asiento) {
                    //Formas de pago
                    //01 - Efectivo
                    //02 - TD
                    //03 - TC
                    //04 - Transferencia CA
                    //05 - Transferencia CC
                    //06 - Caja General
                    //07 - Clientes
                    //08 - Mercado Pago
                    //09 - Mercado Libre Efectivo
                    //10 - Mercado Libre Transferencia
                    //11 - Caja General Local
                    //12 - Proveedores


                    switch (forma_pago) {
                        case '01':
                            var descr = (forma_pago == '01') ? 'Caja Chica: ' : 'Caja Chica - ML: ';
                            //sucursal_id, pos_id, importe, comentario, usuario_id

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pos_id, pagando * (total - descuento), descr + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pos_id, pagando * total, descr + detalle, usuario_id));
                            }
                            break;
                        case '09':
                            var descr = (forma_pago == '01') ? 'Caja Chica: ' : 'Caja Chica - ML: ';
                            //sucursal_id, pos_id, importe, comentario, usuario_id

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pos_id, pagando * (total - descuento), descr + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pos_id, pagando * total, descr + detalle, usuario_id));
                            }
                            break;
                        case '02':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pos_id, pagando * (total - descuento), 'TD: ' + detalle, 'TD', usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pos_id, pagando * total, 'TD: ' + detalle, 'TD', usuario_id));
                            }
                            break;
                        case '03':
                            //sucursal, importe, comentario, tarjeta, usuario_id

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pos_id, pagando * (total - descuento), 'TC: ' + detalle, 'TC', usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pos_id, pagando * total, 'TC: ' + detalle, 'TC', usuario_id));
                            }
                            break;
                        case '04' || '10':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            var descr = (forma_pago == '04') ? 'CA: ' : 'CA - ML: ';

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.bancoCA(sucursal_id, pos_id, pagando * (total - descuento), descr + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.bancoCA(sucursal_id, pos_id, pagando * total, descr + detalle, usuario_id));
                            }
                            break;
                        case '05':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.bancoCC(sucursal_id, pos_id, pagando * (total - descuento), 'CC: ' + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.bancoCC(sucursal_id, pos_id, pagando * total, 'CC: ' + detalle, usuario_id));
                            }
                            break;
                        case '06':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaGeneral(sucursal_id, pos_id, pagando * (total - descuento), 'General: ' + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaGeneral(sucursal_id, pos_id, pagando * total, 'General: ' + detalle, usuario_id));
                            }
                            break;
                        case '07':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.deudores(sucursal_id, pos_id, pagando * (total - descuento), cliente_id, 'Ingreso a Deudores', usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.deudores(sucursal_id, pos_id, pagando * total, cliente_id, 'Ingreso a Deudores', usuario_id));
                            }
                            break;
                        case '08':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.mercadoPago(sucursal_id, pos_id, pagando * (total - descuento), cliente_id, 'Mercado Pago', usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.mercadoPago(sucursal_id, pos_id, pagando * total, cliente_id, 'Mercado Pago', usuario_id));
                            }
                            break;
                        case '11':
                            var descr = 'Caja General Sucursal: ';

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaGeneralSucursal(sucursal_id, pos_id, pagando * (total - descuento), descr + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaGeneralSucursal(sucursal_id, pos_id, pagando * total, descr + detalle, usuario_id));
                            }
                            break;
                        case '12':
                            var descr = 'Proveedores: ';

                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.proveedores(sucursal_id, pos_id, pagando * (total - descuento), cliente_id, descr + detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(sucursal_id, pos_id, descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.proveedores(sucursal_id, pos_id, pagando * total, cliente_id, descr + detalle, usuario_id));
                            }
                            break;

                    }

                    return asiento;
                }

                function getCosto(item, asiento, sucursal_id, pos_id, usuario_id) {
                    //console.log(item);

                    var cant_a_vender = item.cantidad || 1;
                    var stock_final_item = {};
                    var stocks_finales = [];

                    for (var i = 0; i < item.stock.length; i++) {
                        //console.log(new Date(item.stock[i].fecha_compra));
                        //sucursal_id, pos_id, costo, comentario, producto_id, cantidad, usuario_id

                        for(var j = 0; j < MovimientoStockFinal.stocks_finales.length; j++) {
                            if(MovimientoStockFinal.stocks_finales[j].stock_id == item.stock[i].stock_id){
                                //console.log('Encontre producto igual');
                                //console.log(MovimientoStockFinal.stocks_finales[j]);
                                //console.log(item.stock[i]);
                                item.stock[i].cant_actual = MovimientoStockFinal.stocks_finales[j].cant_actual;
                            }
                        }

                        if (cant_a_vender > 0 && item.stock[i].sucursal_id == sucursal_id) {
                            stock_final_item.stock_id = item.stock[i].stock_id;
                            if (cant_a_vender > item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = 0;
                                asiento.push(MovimientosList.cmv(sucursal_id, pos_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, item.stock[i].cant_actual, '', usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, pos_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, item.stock[i].cant_actual, '', usuario_id));
                                cant_a_vender = cant_a_vender - item.stock[i].cant_actual;

                            } else if (cant_a_vender < item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = item.stock[i].cant_actual - cant_a_vender;
                                asiento.push(MovimientosList.cmv(sucursal_id, pos_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, '', usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, pos_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, '', usuario_id));
                                cant_a_vender = 0;

                            } else if (cant_a_vender == item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = 0;
                                asiento.push(MovimientosList.cmv(sucursal_id, pos_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, '', usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, pos_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, '', usuario_id));
                                cant_a_vender = 0;

                            }
                            //stocks_finales.push(stock_final_item);
                            MovimientoStockFinal.stocks_finales.push(stock_final_item);
                            stock_final_item = {};
                        }
                    }
                    //console.log(MovimientoStockFinal.stocks_finales);
                    //MovimientoStockFinal.stocks_finales = stocks_finales;

                    return asiento;
                }


                function getMaxAsiento(callback) {
                    return $http.post(url,
                        {'function': 'getmaxasiento'})
                        .success(function (data) {
                            callback(data);
                        })
                        .error();
                }


                function getBy(params, callback) {
                    return $http.post(url,
                        {"function": "getby"})
                        .success(callback)
                        .error(function (data) {

                        });

                }

                function get(callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./directives/cuentas/api/cuentas.php',
                        {"function": "get"},
                        {cache: true})
                        .success(callback)
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                }

                function deleteAsiento(id, sucursal_id, callback) {
                    return $http.post(url,
                        {"function": "deleteAsiento", "id": id, "sucursal_id": sucursal_id})
                        .success(function (data) {
                            callback(data);
                        })
                        .error(error)
                }


                function save(callback, params) {
                    return $http.post(url,
                        {"function": "save", "params": JSON.stringify(params)},
                        {cache: true})
                        .success(function (data) {
                            console.log(data);
                            results(callback, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                }


                function error(data) {
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data) {
                    if (data.Error === undefined) {
                        callback(data);
                    } else {
                    }
                }

                return service;
            }]);


})()
/**
 * Created by desa on 1/2/15.
 */
