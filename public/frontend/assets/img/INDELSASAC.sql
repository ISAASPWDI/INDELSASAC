CREATE DATABASE indelsasac;
USE indelsasac;
-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'user') DEFAULT 'user'
);
-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    marca VARCHAR(50),
    imagen VARCHAR(255)
);
-- Tabla de detalles técnicos
CREATE TABLE detalles_tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    detalles JSON NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

-- 1
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PAPEL AISLANTE NMN',
    'Es un laminado flexible compuesto de papel aramida Nomex® y un film de poliéster PETP Mylar®, en forma triplex con el papel Nomex® recubriendo las caras exteriores del material. Se fabrica en diferentes versiones, combinando entre si el papel Nomex® con el film de poliéster. Los tipos están fabricados con Nomex® calandrado de 50 micras respectivamente recubriendo ambas caras de film de poliéster, poseen una superficie satinada que permite la inserción en ranura utilizando máquinas automáticas.',
    'ISOVOLTA',
    'papel_aislante_nmn.webp'
);
-- 2
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PAPEL PRESSPAHN',
    'Papel aislante que se fabrica con sulfato de celulosa 100% de alta pureza. La mezcla húmeda se presiona y se seca al mismo tiempo para obtener un resultado con una buena estabilidad dimensional y resistencia mecánica. Como tiene alta resistencia mecánica y baja compresibilidad es ideal para la fabricación de separadores radiales y axiales, corredores, etc. Para transformadores de alto y medio poder.',
    'WEIDMANN, ISOLIERSTOFFE',
    'papel_presspahn.webp'
);
-- 3
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'FILM POLIESTER MYLAR',
    'Film utilizado en el aislamiento de motores alternadores y transformadores, la aplicación es en ranuras o entrefase, así como en la protección de condensadores.',
    'DUPONT',
    'fILM_POLIESTER_mylar.webp'
);
-- 4
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PAPEL NOMEX PURO T410',
    'El papel Aislante Nomex Puro, es la opción ideal para las aplicaciones de aislamiento de placas eléctricas conocidas. Alta resistencia dieléctrica inherente. Estabilidad térmica. Resiste tensiones eléctricas de corto plazo de hasta 18 kV/mm.',
    'DUPONT',
    'PAPEL_NOMEX_PURO_T410.webp'
);
-- 5
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PAPEL MELINEX',
    'Este papel de aislamiento eléctrico se aplica para equipos de bajo voltaje, motores, generadores y aparatos eléctricos, basado en la ranura de aislamiento, forro o entre espiras. Además, este papel contiene película de poliéster para mayor resistencia mecánica.',
    NULL,
    'papel_melinex.webp'
);
-- 6
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PAPEL PESCADO',
    'Un fuerte, material elástico y suave hecho por el tratamiento de la celulosa de algodón. Tiene excelentes propiedades mecánicas, alta resistencia dieléctrica en condiciones severas.',
    NULL,
    'papel_pescado.webp'
);
-- 7
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CARTÓN PRESSPAHN',
    'Es un material aislante con una base celulosa utilizada en clase térmica A. Este cartón se puede cortar, sellar y doblar sin problema, facilitando los procesos subsecuentes. Alta fuerza dieléctrica. No presenta punto de fusión. Buena capacidad de impregnación.',
    'WEIDMANN',
    'cartón_presspahn.webp'
);
-- 8
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PLACAS DE VITRONITE “H”',
    'Es un estratificado compuesto de láminas de tejido de vidrio impregnadas con resina epoxi, prensadas bajo temperatura y alta presión. Tiene altas propiedades mecánicas y eléctricas, se puede aplicar a generadores, motores y aparatos eléctricos como partes estructurales aislantes.',
    'ISOVOLTA',
    'placas_de_vitronite_H.webp'
);

-- 9
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CANEVASITA',
    'Formado a base de tejido de algodón fino y resina fenólica, con propiedades que facilitan un excelente mecanizado. Muy útil para piezas que requieran una alta capacidad de aislamiento eléctrico.',
    'WESTINGHOUSE',
    'canevasita.webp'
);
-- 10
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'PLACAS DE BAQUELITA',
    'La baquelita es una placa estratificada compuesta a base de cartón prensado y resina fenólica. Destacada por su función aislante de energía.',
    'WESTINGHOUSE',
    'placas_de_baquelita.webp'
);
-- 11
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CAPACITORES',
    'Básicamente un condensador es un dispositivo capaz de almacenar energía en forma de campo eléctrico. Utilizados en el arranque de motores eléctricos monofásicos.',
    NULL,
    'capacitores.webp'
);
-- 12
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'SELLOS MECÁNICOS TRISUN',
    'Los sellos mecánicos son dispositivos que ayudan a unir una parte fija con una móvil en mecanismos o sistemas usando presión para cerrar herméticamente la unión. Evitando así, la fuga de fluidos, conteniendo la presión y no permitiendo el ingreso de contaminación. Los sellos mecánicos se utilizan en bombas, compresores y otros tipos de equipos rotantes.',
    NULL,
    'sellos_mecánicos_trisun.webp'
);
-- 13
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'ALAMBRE DE COBRE DOBLE ESMALTE',
    'Alambre de cobre de sección circular aislado con doble capa para aplicaciones herméticas de clase térmica de 200 °C. En los bobinados de equipos eléctricos con temperatura de operación del orden de los 200 °C, para motores de tracción, aparatos electrodomésticos, transformadores. En cualquier equipo sujeto a condiciones severas de humedad y calor.',
    NULL,
    'alambre_de_cobre_doble_esmalte.webp'
);
-- 14
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'SPAGUETTI BARNIZADO ACRÍLICO',
    'Es un tubo trenzado de fibra de vidrio recubierto con barniz de polluretano. Este tubo es apropiado en motores y aparatos de clase térmica F. Este resiste picos de hasta 190 °C durante cortos periodos de tiempo. Elevada flexibilidad. Buena resistencia mecánica.',
    'ACRIFLEX',
    'spaguettI_barnizado_acrílico.webp'
);
-- 15
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CABLES INDECO',
    'Cable NH-80 2.5mm2 450/750V libre halógeno azul, clase 2, x rollo, Practicable INDECO / Cable NH-80 6mm2 450/750V libre halógeno rojo, clase 2, x rollo, Practicable INDECO: Uso: minería, oil&gas, industria y construcción. Alternativo a los modelos: TW, THW y THHN. Cable THW-90+ 144WG, 750V aislamiento PVC azul, clase 2, x rollo INDECO: Cable de construcción rígido clase 2, (90°C T° operación), aislamiento de PVC (retardante y no propagador a la llama (IEC 60332-1-2)). V: 750V. Instalación: ducto, bandejas, cableado de tableros de control. Uso: minería, oil&gas, industria y construcción. Alternativo a los modelos: TW.',
    NULL,
    'cables_indeco.webp'
);
-- 16
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CABLE DE COBRE SILICONADO ESTAÑADO',
    'Los cables de silicona (ENERGY®) se caracterizan por una resistencia a altas temperaturas hasta + 230°C y al mismo tiempo con una flexibilidad permanente. Debido a la estructura molecular reticulada, los cables de silicona permanecen en su forma original también con influencia de la temperatura. Este cable se compone de un conductor de Cobre rojo Clase 5 NFC 32-013, Estañado con chaqueta de Caucho de silicona AGR.',
    'ENERGY',
    'CABLE_DE_COBRE_SILICONADO_ESTAÑADO.webp'
);

-- 17
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA FILAMENTAPE',
    'Cinta compuesta con adhesivo de resina de caucho especialmente formulado que se adhiere a las superficies de tableros de fibra, plástico y metal. El reverso de polipropileno proporciona una excelente resistencia a las mellas, a la abrasión, a la humedad y al desgaste.',
    'FLMTape',
    'cinta_filamentape.webp'
);
-- 18
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA POLIESTER',
    'Cintas de alta resistencia mecánica y eléctrica, para ser usado en amarres de bobinas en motores y transformadores, el cual ayuda a formar una bobina compacta, de muy buena absorción de ante la impregnación de barnices y resinas dieléctricas.',
    'SOLSA',
    'cinta_poliester.webp'
);

-- 19
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA DE ALGODÓN',
    'Cintas planas tejidas a partir de hilo 100% algodón, para ser usado en aplicaciones electromecánicas en general como cintas de acabado y consolidación, las cuales proporcionan un excelente sustrato para barnices aislantes de acabado.',
    'SOLSA',
    'cinta_de_algodón.webp'
);

-- 20
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA DE VIDRIO SIN BARNIZ',
    'La principal utilización de las cintas de tejido de vidrio está en el encintado de bobinas, como refuerzo mecánico, térmico y dieléctrico. Debido a su gran poder absorbente, las cintas de tejido de vidrio permiten ser impregnadas con barnices y resinas dieléctricas, formando así un bloque compacto y duro.',
    'SERTEK',
    'cinta_de_vidrio_sin_barniz.webp'
);

-- 21
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA BRAIDAD',
    'Está compuesta a base de hilo de poliéster trenzado plano combinado con hilos de vidrio de filamento continuo de alta tenacidad. La cinta BRAIDAD minimiza los enganchones, mejora la unión del aislamiento y cuando está recubierta, no se encrespa, no deshilacha y no se deshace. Se usa para aplicaciones electromecánicas como cinta de amarre de CABEZAS DE BOBINAS.',
    NULL,
    'cinta_braidad.webp'
);
-- 22
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA KAPTON HN',
    'La cinta Kapton, también conocida como cinta de poliamida, es una cinta eléctricamente aislante y resistente al calor que tiene muchos usos para reparación.',
    'DUPONT',
    'cinta_kapton_HN.webp'
);

-- 23
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA DE MICA REMIKAFLEX 45005',
    'Las gama de cintas de mica Remikaflex se utilizan habitualmente para el aislamiento de las cabezas de bobinas en máquinas eléctricas rotativas de alto voltaje que trabajan con sistemas de aislamiento de clase térmica F (155°C).',
    'COGEBI',
    'cinta_de_mica_REMIKAFLEX_45005.webp'
);

-- 24
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA CREPE',
    'El papel crepe se utiliza principalmente en la construcción de transformadores de aceite. El crepado del papel permite su adaptación a cualquier superficie y permite obtener paredes de aislamiento gruesas (en función del número de capas) para mantener la separación física y eléctrica de los componentes.',
    'WEIDMANN',
    'cinta_crepe.webp'
);

-- 25
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA NOMEX T410',
    'Esta cinta desarrollada por Dupont tiene una excelente resistencia térmica y mecánica. Es muy utilizado para motores y generadores de baja y media tensión y en transformadores de potencia y distribución.',
    'DUPONT',
    'cinta_nomex_T410.webp'
);

-- 26
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'CINTA PARA BANDAJE',
    'La cinta isoglass está formada por hilos de fibra de vidrio sin torsión, paralelos entre sí y sin trama. Se mantienen unidos mediante una impregnación con resina de poliéster y polimeriza por calor, formando un vendaje sólido y compacto.',
    'ISOVOLTA',
    'CINTA_para_BANDAJE.webp'
);

-- 27
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'BARNIZ MEGA OHM',
    'BARNIZ SECADO AL HORNO: Es un barniz de uso general de resinas modificadas para la aplicación convencional por inmersión y horneado en transformadores, estatores, armaduras y embobinados en general. BARNIZ ROJO SECADO AL AIRE: MEGA OHM 150 es un esmalte aislante de color rojo y de secado al aire. Está diseñado para la protección eléctrica y ambiental de equipos eléctricos, se pueden limpiar fácilmente con solventes comunes. BARNIZ TRANSPARENTE SECADO AL AIRE: MEGA OHM 200 es un barniz transparente de secado al aire, formulado para ser usado en transformadores y motores, donde su flexibilidad y rápido curado es una ventaja.',
    NULL,
    'barniz_mega_ohm.webp'
);
-- 28
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'RESINA EPOXICA',
    'RESINA EPOXICA A+B CLASE H: Es un compuesto epóxico de uso eléctrico especialmente formulado para el campo eléctrico donde se necesita resistencia de aislamiento Clase H, aplicable en revestimiento y encapsulados de bobinas. RESINA EPOXICA A+B CLASE F: Es una resina epóxica de uso eléctrico utilizado especialmente donde la estabilidad térmica es un factor importante, aplicable en la fabricación de encapsulados eléctricos y aisladores, soporte, llaves, bushings, transformadores de corriente y voltaje, etc.',
    NULL,
    'resina_epoxica.webp'
);

-- 29
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'BARNIZ INTERPAINTS',
    'BARNIZ AISLANTE THERM-O-CORE: Es usado como recubrimiento aislante en bobinas de motores eléctricos. La dureza que adquiere luego de horneado permite la adhesión y formación de un cuerpo compacto capaz de resistir las mas adversas condiciones de operación.',
    NULL,
    'barniz_interpaints.webp'
);

-- 30
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'BARNIZ DOLPH’S',
    'BC-346-A es un barniz de alta temperatura especialmente formulado, que se puede utilizar en una amplia gama de aplicaciones de inmersión y horneado.',
    NULL,
    'barniz_dolphs.webp'
);

-- 31 
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'ACEITE DIELÉCTRICO MINERAL NYNAS',
    'NYTRO LIBRA: Destacado en la aplicación de transformadores, el aceite Nynas Nytro Libra está desarrollado para manejar cualquier diseño y condición de funcionamiento. Cumple la función de mantenimiento y destaca por sus características de transferencia de calor extremadamente buenas. DISTRO DT-11: Destacado en la aplicación de transformadores de distribución, el Distro DT-11 es un aceite aislante inhibido que se puede aplicar en un nivel de voltaje menor que 72 kV. Destaca por su uso como herramienta de diagnóstico para transformadores.',
    NULL,
    'aceite_dieléctrico_Mineral_nynas.webp'
);
-- 32
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'GPO3',
    'GPO 3 puede ser utilizado como material de construcción de alta calidad en la industria eléctricomecánica, química, etc. Aislamiento eléctrico y térmico en máquinas y equipos diversos.',
    'ISOVOLTA',
    'gpo3.webp'
);

-- 33
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'ASLADORES DE PORCELANA',
    'MEDIA TENSIÓN ENC (20KV/250A DIN): Cumplen la función de sujetar mecánicamente a los conductores que forman parte de la línea, manteniéndolos aislados de tierra y de otros conductores. Los aisladores de media tensión operan con voltajes superiores a 1000V hasta 36000V. ALTA TENSIÓN ENC (40KV/250A DIN): Cumplen la función de sujetar mecánicamente a los conductores que forman parte de la línea, manteniéndolos aislados de tierra y de otros conductores. Los aisladores de alta tensión operan con voltajes superiores a 36000V.',
    NULL,
    'aisladores_de_porcelana.webp'
);

-- 34
INSERT INTO productos (nombre, descripcion, marca, imagen)
VALUES (
    'SOLDADURA DE ESTAÑO',
    'La soldadura de estaño 60/40 y 50/50, es la unión de metales a través del uso de calor y de una aleación de aporte, cuyo punto de fusión es menor a 450°C. Estas soldaduras se usan en instalaciones de agua potable (fría y caliente) y gas, a baja presión, así como en contactos eléctricos y electrónicos.',
    NULL,
    'soldadura_de_estaño.webp'
);

INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    1,
    '{
        "Espesores": "Desde 0.15 mm hasta 0.47 mm",
        "Clase Térmica": "F (155°C)",
        "Propiedades": "Excelentes propiedades físicas y dieléctricas"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    2,
    '{
        "Espesores": "Desde 0.10 mm hasta 0.50 mm",
        "Clase Térmica": "A (105°C)",
        "Propiedades": "Excelentes propiedades físicas y dieléctricas"
    }'
);

INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    3,
    '{
        "Espesores": "0.10 mm, 0.15 mm, 0.20 mm, 0.25 mm, 0.30 mm, 0.35 mm",
        "Clase Térmica": "B (130°C)",
        "Propiedades": "Excelentes propiedades físicas y dieléctricas"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    4,
    '{
        "Medidas": "0.08 mm, 0.13 mm, 0.20 mm, 0.35 mm, 0.38 mm, 0.47 mm, 0.50 mm",
        "Clase Térmica": "H (180°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    5,
    '{
        "Espesores": "0.15 mm, 0.25 mm, 0.30 mm",
        "Clase Térmica": "A (105°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    6,
    '{
        "Espesores": "0.10 mm, 0.15 mm, 0.20 mm, 0.25 mm, 0.30 mm",
        "Clase Térmica": "A (105°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    7,
    '{
        "Espesores": "1.0 mm, 2.0 mm, 3.0 mm, 4.0 mm, 5.0 mm, 6.0 mm, 10 mm",
        "Formato": "1000 x 2000 mm"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    8,
    '{
        "Espesores": "Desde 1 mm hasta 20 mm",
        "Formato": "1000 x 1000 mm Aprox.",
        "Clase Térmica": "H (180°C)",
        "Color": "Amarillo Verde"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    9,
    '{
        "Espesores": "Desde 1 mm hasta 50 mm",
        "Formato": "1000 x 1000 mm",
        "Clase Térmica": "B (130ºC)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    10,
    '{
        "Espesores": "Desde 1 mm hasta 50 mm",
        "Formato": "1000 x 1000 mm",
        "Clase Térmica": "B (130ºC)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    11,
    '{
        "Capacitores de Arranque Negro": "Desde 64-74 µF hasta 850 -1020 µF / 250VAC y 125VAC",
        "Capacitores de Arranque Azul c/ Cable": "Desde 100 µF hasta 600 µF / 250VAC y 300VAC",
        "Capacitores de Marcha Constante": "Desde 6 µF hasta 80 µF / 450VAC",
        "Capacitores para Ventilador": "Desde 1 µF hasta 6 µF / 450VAC"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    12,
    '{
        "FA": "TS 301",
        "CONICO": "TS 155",
        "RESORTE LARGO": "TS 560A - 1",
        "RESORTE CORTO": "TS E",
        "PISCINA": "TS FT TS FB",
        "MG1": ""
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    13,
    '{
        "Calibres": "Desde 26 AWG hasta 13 AWG",
        "Clase Térmica": "200°C"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    14,
    '{
        "Diámetro Interior": "0.5 mm, 1 mm, 1.5 mm, 2 mm, 2.5 mm, 3 mm, 4 mm, 5 mm, 6 mm, 7 mm, 8 mm, 10 mm, 12 mm, 14 mm, 16 mm, 18 mm, 20 mm, 22 mm",
        "Clase Térmica": "F (155° C)",
        "Tensión de Ruptura": "3000 V"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    15,
    '{}'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    16,
    '{
        "Calibre": "0.75 mm, 0.1 mm, 1.5 mm, 2.5 mm, 4 mm, 6 mm, 10 mm, 16 mm, 25 mm, 0.35 mm, 0.1 mm, 50 mm, 70 mm, 90 mm",
        "Clase Térmica": "200°C",
        "Voltaje de Trabajo": "600 V"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    17,
    '{
        "Medidas": "19 mm x 55 mts",
        "Propiedades": "Excelentes propiedades físicas y dieléctricas"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    18,
    '{
        "Medidas": "15 mm x 50 mts, 20 mm x 50 mts, 25 mm x 50 mts",
        "Clase Térmica": "B (130°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    19,
    '{
        "Espesores": "12 mm x 33 mt, 20 mm x 33 mt, 25 mm x 33 mt",
        "Clase Térmica": "A (105°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    20,
    '{
        "Medidas": "0.08 mm x 20 mm x 50 mt, 0.13 mm x 20 mm x 50 mt, 0.08 mm x 25 mm x 50 mt, 0.13 mm x 25 mm x 50 mt",
        "Clase Térmica": "C (220°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    21,
    '{
        "Medidas": "4 mm, 7 mm, 10 mm",
        "Clase Térmica": "F (155°C)",
        "Longitud": "230 rms, 350 rms"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    22,
    '{
        "Espesores": "0.025 mm, 0.050 mm",
        "Ancho": "15 mm, 20 mm"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    23,
    '{
        "Espesor": "0.14 mm",
        "Ancho": "20 mm",
        "Longitud": "50 mts"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    24,
    '{
        "Espesores": "0.10 mm, 0.15 mm"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    25,
    '{
        "Medidas": "0.05 mm x 12.5 mm x 440 mt, 0.05 mm x 15 mm x 440 mt",
        "Clase Térmica": "H (180 °C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    26,
    '{
        "Medidas": "0.30 mm x 20 mm x 200 mt, 0.30 mm x 25 mm x 200 mt",
        "Clase Térmica": "F (155°C), H (180°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    27,
    '{
        "Presentaciones": "Cilindros, Galones",
        "Clase Térmica": "F (155 °C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    28,
    '{}'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    29,
    '{
        "Clase Térmica": "F (155°C)",
        "Disponibilidad": "Barniz secado al horno, Barniz secado al aire, Barniz rojo secado al aire",
        "Presentación": "Galón / 3.785 Litros Aprox."
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    30,
    '{
        "Presentaciones": "Cilindros, Galones",
        "Clase Térmica": "H (180°C)"
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    31,
    '{
        "Presentaciones": "Cilindros",
        "Propiedades": [
            "Buena transferencia de calor",
            "Estabilidad fiable a la oxidación",
            "Contienen niveles bajos de hidrocarburos poliaromáticos (PAH)",
            "Muy buenas propiedades a baja temperatura",
            "Mayor estabilidad ante esfuerzos eléctricos"
        ]
    }'
);
INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    32,
    '{
        "Formato": "1000 x 1000 mm",
        "Espesores": "1 mm, 2 mm, 3 mm, 4 mm, 5 mm, 6 mm, 8 mm, 10 mm",
        "Clase Térmica": "F (155°C)"
    }'
);

INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    33,
    '{}'
);

INSERT INTO detalles_tecnicos (id_producto, detalles)
VALUES (
    34,
    '{
        "Disponibilidad Carretes": "250Gr, 500Gr",
        "Calibres": "0.8 mm, 1 mm"
    }'
);