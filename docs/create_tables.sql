
# MOVIMIENTOS
CREATE TABLE movimientos (
  movimiento_id int(11) NOT NULL,
  asiento_id int(11) DEFAULT NULL,
  fecha timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  cuenta_id varchar(10) DEFAULT NULL,
  usuario_id int(11) DEFAULT NULL,
  importe decimal(10,2) DEFAULT NULL,
  sucursal_id int(11) DEFAULT NULL,
  pos_id int(2) DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=105870 DEFAULT CHARSET=utf8;

# DETALLES MOVIMIENTOS
CREATE TABLE detallesmovimientos (
  detalle_movimiento_id int(11) NOT NULL,
  detalle_tipo_id int(11) DEFAULT NULL,
  valor varchar(400) DEFAULT NULL,
  movimiento_id int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;