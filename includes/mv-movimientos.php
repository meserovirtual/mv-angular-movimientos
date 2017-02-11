<?php

session_start();

if (file_exists('../../../includes/MyDBi.php')) {
    require_once '../../../includes/MyDBi.php';
    require_once '../../../includes/utils.php';
} else {
    require_once 'MyDBi.php';
}


class Movimientos extends Main
{
    private static $instance;

    public static function init($decoded)
    {
        self::$instance = new Main(get_class(), $decoded['function']);
        try {
            call_user_func(get_class() . '::' . $decoded['function'], $decoded);
        } catch (Exception $e) {

            $file = 'error.log';
            $current = file_get_contents($file);
            $current .= date('Y-m-d H:i:s') . ": " . $e . "\n";
            file_put_contents($file, $current);

            header('HTTP/1.0 500 Internal Server Error');
            echo $e;
        }
    }


    function getProductos()
    {
        $db = self::$instance->db;;
        $precios_arr = array();
        $proveedores_arr = array();
        $stocks_arr = array();
        $final = array();
//    $results = $db->get('productos');

        $results = $db->rawQuery(
            "SELECT producto_id,
            nombre,
            descripcion,
            pto_repo,
            cuenta_id,
            sku,
            status,
            vendidos,
            destacado,
            categoria_id,
            (SELECT nombre FROM categorias c WHERE c.categoria_id = p.categoria_id) categoria,
            0 fotos,
            0 precios,
            0 proveedores,
            0 stocks
        FROM productos p;");

        foreach ($results as $row) {

            $db->where("producto_id", $row["producto_id"]);
            $fotos = $db->get('fotos_prod');
            $row["fotos"] = $fotos;
            array_push($precios_arr, $row);
        }

        foreach ($precios_arr as $row) {

            $db->where("producto_id", $row["producto_id"]);
            $precios = $db->get('precios');
            $row["precios"] = $precios;
            array_push($stocks_arr, $row);
        }

        foreach ($stocks_arr as $row) {

            $db->where("producto_id", $row["producto_id"]);
            $db->where("cant_actual > 0");
            $db->orderBy('fecha_compra', 'asc');
            $precios = $db->get('stock');
            $row["stocks"] = $precios;
            array_push($proveedores_arr, $row);
        }

        foreach ($proveedores_arr as $row) {

            $db->where("producto_id", $row["producto_id"]);
            $proveedores = $db->get('prov_prod');
            $row["proveedores"] = $proveedores;
            array_push($final, $row);
        }


        echo json_encode($final);
    }


    function get($params)
    {

    }

    function getMaxAsiento()
    {

        $db = self::$instance->db;;
        $results = $db->rawQuery("select max(asiento_id) asiento from movimientos");
        if ($results[0]['asiento'] === null) {
            echo 0;
        } else {
            echo json_encode($results[0]['asiento']);
            return $results[0]['asiento'];
        }


    }

    function save($params)
    {

        $asiento_id = json_decode(self::getMaxAsiento());
        $asiento_id = $asiento_id + 1;

        foreach (json_decode($params['params']) as $movimiento) {
            $db = self::$instance->db;;


            $decoded = $movimiento;


            $data = array(
                "cuenta_id" => $decoded->cuenta_id,
                "asiento_id" => $asiento_id,
                "importe" => $decoded->importe,
                "usuario_id" => $decoded->usuario_id,
                "sucursal_id" => $decoded->sucursal_id,
                "pos_id" => $decoded->pos_id
            );

            $id = $db->insert("movimientos", $data);
            if ($id) {
                foreach ($decoded->detalles as $detalle) {
                    self::saveDetalle($id, $detalle);
                }
            }

        }



//    print_r($query["sql"]);
//    $result = $query["status"];
//    echo $db->getLastError();
        if ($id) {
            echo json_encode(1);
        } else {
            echo json_encode(Array("Error" => $db->getLastError()));
        }
    }

    function saveDetalle($movimiento_id, $detalle)
    {
        $db = self::$instance->db;;
        $decoded = $detalle;


        $data = array(
            "detalle_tipo_id" => $decoded->detalle_tipo_id,
            "valor" => $decoded->valor,
            "movimiento_id" => $movimiento_id
        );

        $id = $db->insert("detallesmovimientos", $data);


//    print_r($query["sql"]);
//    $result = $query["status"];
//    echo $db->getLastError();
        if ($id) {
            echo json_encode(1);
        } else {
            echo json_encode(Array("Error" => $db->getLastError()));
        }
    }

    function deleteAsiento($params)
    {
        $db = self::$instance->db;
        $db_upd = self::$instance->db;;

        $results = $db->rawQuery('select valor from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = ' . $params['id'] . ' AND cuenta_id like "4.1.1.%") and detalle_tipo_id = 8;');
        foreach ($results as $row) {

            $tipo = $db->rawQuery('select producto_tipo from productos where producto_id =' . $row["valor"]);


            if ($tipo[0]['producto_tipo'] == 2) {
                $kits = $db->rawQuery('select producto_id from productos_kits where parent_id =' . $row["valor"]);

                foreach ($kits as $kit) {
                    $restante = $db->rawQuery('select valor from detallesmovimientos where movimiento_id in (select movimiento_id from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = ' . $params['id'] . ' AND cuenta_id = "1.1.7.01") and detalle_tipo_id = 8 and valor=' . $kit['producto_id'] . ') and detalle_tipo_id = 13;');
//                $db->where('cant_actual < cant_inicial');


                    $SQL_STOCK = 'select * from stock where sucursal_id = ' . $params['sucursal_id'] . ' and producto_id = ' . $kit['producto_id'] . ' and cant_actual < cant_inicial order by fecha_compra, cant_actual';
                    $stocks = $db->rawQuery($SQL_STOCK);


                    foreach ($stocks as $stock) {

                        if ($restante[0]["valor"] > 0) {
                            if ($stock['cant_actual'] + $restante[0]["valor"] == $stock['cant_inicial']) {

                                $stock['cant_actual'] = $stock['cant_inicial'];
                                $restante[0]["valor"] = 0;
                            }

                            if ($stock['cant_actual'] + $restante[0]["valor"] < $stock['cant_inicial']) {

                                $stock['cant_actual'] = $stock['cant_actual'] + $restante[0]["valor"];
                                $restante[0]["valor"] = $restante[0]["valor"] - $stock['cant_actual'];
                            }

                            if ($stock['cant_actual'] + $restante[0]["valor"] > $stock['cant_inicial']) {

                                $stock['cant_actual'] = $stock['cant_inicial'];
                                $restante[0]["valor"] = 0;
                            }


                            $SQL = 'Update stock set cant_actual = ' . $stock['cant_actual'] . ' where stock_id=' . $stock["stock_id"];
                            $db->rawQuery($SQL);

                        }


                    }
                }

            } else {

                $restante = $db->rawQuery('select valor from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = ' . $params['id'] . ' AND cuenta_id like "4.1.1.%") and detalle_tipo_id = 13;');
                $db->where('cant_actual < cant_inicial');


                $SQL_STOCK = 'select * from stock where sucursal_id = ' . $params['sucursal_id'] . ' and producto_id = ' . $row["valor"] . ' and cant_actual < cant_inicial order by fecha_compra, cant_actual';
                $stocks = $db->rawQuery($SQL_STOCK);


                foreach ($stocks as $stock) {

                    if ($restante[0]["valor"] > 0) {
                        if ($stock['cant_actual'] + $restante[0]["valor"] == $stock['cant_inicial']) {

                            $stock['cant_actual'] = $stock['cant_inicial'];
                            $restante[0]["valor"] = 0;
                        }

                        if ($stock['cant_actual'] + $restante[0]["valor"] < $stock['cant_inicial']) {

                            $stock['cant_actual'] = $stock['cant_actual'] + $restante[0]["valor"];
                            $restante[0]["valor"] = $restante[0]["valor"] - $stock['cant_actual'];
                        }

                        if ($stock['cant_actual'] + $restante[0]["valor"] > $stock['cant_inicial']) {

                            $stock['cant_actual'] = $stock['cant_inicial'];
                            $restante[0]["valor"] = 0;
                        }


                        $SQL = 'Update stock set cant_actual = ' . $stock['cant_actual'] . ' where stock_id=' . $stock["stock_id"];
                        $db->rawQuery($SQL);

                    }


                }

            }


//

//        $db->rawQuery('Update stock set cant_actual = cant_actual + 1 where producto_id='.$row["valor"]);
        }

        $db->rawQuery("delete from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = " . $params['id'] . ")");
        $db->rawQuery("delete from movimientos where asiento_id = " . $params['id']);

        if ($db->getLastError() !== '') {
            echo json_encode($db->getLastError());
        }
    }



}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents("php://input");
    $decoded = json_decode($data);
    Movimientos::init(json_decode(json_encode($decoded), true));
} else {
    Movimientos::init($_GET);
}






//if ($decoded->function === 'get') {
//    get($decoded->params);
//} else if ($decoded->function === 'save') {
//
//
//    $asiento_id = json_decode(getMaxAsiento());
//    $asiento_id = $asiento_id + 1;
//
//    foreach (json_decode($decoded->params) as $movimiento) {
//        save($movimiento, $asiento_id);
//    }
////    save($decoded->asiento);
//} else if ($decoded->function === 'getmaxasiento') {
//    getMaxAsiento();
//} else if ($decoded->function === 'deleteAsiento') {
//    deleteAsiento($decoded->id, $decoded->sucursal_id);
//} else if ($decoded->function === 'getProductos') {
//    getProductos();
//}
//
