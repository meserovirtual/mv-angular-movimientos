<?php

session_start();

// Token
$decoded_token = null;

if (file_exists('../../../includes/MyDBi.php')) {
    require_once '../../../includes/MyDBi.php';
    require_once '../../../includes/config.php';
} else {
    require_once 'MyDBi.php';
}

$data = file_get_contents("php://input");

// Decode data from js
$decoded = json_decode($data);


// Si la seguridad está activa
if ($jwt_enabled) {

    // Carga el jwt_helper
    if (file_exists('../../../jwt_helper.php')) {
        require_once '../../../jwt_helper.php';
    } else {
        require_once 'jwt_helper.php';
    }


    // Las funciones en el if no necesitan usuario logged
    if (($decoded == null) && (($_GET["function"] != null) &&
            ($_GET["function"] == 'getProductos'))
    ) {
        $token = '';
    } else {
        checkSecurity();
    }

}

if ($decoded->function === 'get') {
    get($decoded->params);
} else if ($decoded->function === 'save') {


    $asiento_id = json_decode(getMaxAsiento());
    $asiento_id = $asiento_id + 1;

    foreach (json_decode($decoded->params) as $movimiento) {
        save($movimiento, $asiento_id);
    }
//    save($decoded->asiento);
} else if ($decoded->function === 'getmaxasiento') {
    getMaxAsiento();
} else if ($decoded->function === 'deleteAsiento') {
    deleteAsiento($decoded->id, $decoded->sucursal_id);
} else if ($decoded->function === 'getProductos') {
    getProductos();
}


function getProductos()
{
    $db = new MysqliDb();
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

    $db = new MysqliDb();
    $results = $db->rawQuery("select max(asiento_id) asiento from movimientos");
    if ($results[0]['asiento'] === null) {
        echo 0;
    } else {
        echo json_encode($results[0]['asiento']);
        return $results[0]['asiento'];
    }


}

function save($movimiento, $asiento_id)
{


    $db = new MysqliDb();


    $decoded = $movimiento;


    $data = array(
        "cuenta_id" => $decoded->cuenta_id,
        "asiento_id" => $asiento_id,
        "importe" => $decoded->importe,
        "usuario_id" => $decoded->usuario_id,
        "sucursal_id" => $decoded->sucursal_id
    );

    $id = $db->insert("movimientos", $data);
    if ($id) {
        foreach ($decoded->detalles as $detalle) {
            saveDetalle($id, $detalle);
        }
    }


//    print_r($query["sql"]);
//    $result = $query["status"];
//    echo $db->getLastError();
    if ($id) {
        echo 'Dato guardado con éxito';
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }
}

function saveDetalle($movimiento_id, $detalle)
{
    $db = new MysqliDb();
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
        echo 'Dato guardado con éxito';
    } else {
        echo json_encode(Array("Error" => $db->getLastError()));
    }
}

function deleteAsiento($id, $sucursal_id)
{
    $db = new MysqliDb();
    $db_upd = new MysqliDb();

    $results = $db->rawQuery('select valor from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = ' . $id . ' AND cuenta_id like "4.1.1.%") and detalle_tipo_id = 8;');
    foreach ($results as $row) {
        $restante = $db->rawQuery('select valor from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = ' . $id . ' AND cuenta_id like "4.1.1.%") and detalle_tipo_id = 13;');


        $db->where('cant_actual < cant_total');
        $db->where('producto_id', $row["valor"]);
        $db->where('sucursal_id', $sucursal_id);
        $db->orderBy('fecha_compra');
        $db->orderBy('cant_actual');
        $stocks = $db->get('stock');

        foreach ($stocks as $stock) {

            if ($restante[0]["valor"] > 0) {
                if ($stock['cant_actual'] + $restante[0]["valor"] == $stock['cant_total']) {

                    $stock['cant_actual'] = $stock['cant_total'];
                    $restante[0]["valor"] = 0;
                }

                if ($stock['cant_actual'] + $restante[0]["valor"] < $stock['cant_total']) {

                    $stock['cant_actual'] = $stock['cant_actual'] + $restante[0]["valor"];
                    $restante[0]["valor"] = $restante[0]["valor"] - $stock['cant_actual'];
                }

                if ($stock['cant_actual'] + $restante[0]["valor"] > $stock['cant_total']) {

                    $stock['cant_actual'] = $stock['cant_total'];
                    $restante[0]["valor"] = 0;
                }


                $SQL = 'Update stock set cant_actual = ' . $stock['cant_actual'] . ' where stock_id=' . $stock["stock_id"];
                $db->rawQuery($SQL);

            }


        }

//        $db->rawQuery('Update stock set cant_actual = cant_actual + 1 where producto_id='.$row["valor"]);
    }

    $db->rawQuery("delete from detallesmovimientos where movimiento_id in (select movimiento_id from movimientos where asiento_id = " . $id . ")");
    $db->rawQuery("delete from movimientos where asiento_id = " . $id);

    if ($db->getLastError() !== '') {
        echo json_encode($db->getLastError());
    }
}


?>