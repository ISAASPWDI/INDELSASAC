<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
// Para debugging
file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Iniciando API\n", FILE_APPEND);


require_once __DIR__ . '/../controllers/ProductoController.php';
require_once __DIR__ . '/../controllers/UsuarioController.php';
require_once __DIR__ . '/../controllers/CategoriaController.php';
require_once __DIR__ . '/../config/Database.php';

// Inicializar la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();


$productController = new ProductoController();
$categoryController = new CategoriaController();
$usuarioController = new UsuarioController($db);

// Obtener la ruta
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/indelsaRepo/public/api/'; // Ajustar esto si la base cambia

// Depuración: Registrar la URL completa y la ruta base
file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] URL completa: $request_uri\n", FILE_APPEND);
file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Ruta base: $base_path\n", FILE_APPEND);

// Asegurar que el path sea relativo a la API
if (strpos($request_uri, $base_path) === 0) {
    $path = trim(substr($request_uri, strlen($base_path)));
} else {
    $path = '';
}
$path = strtok($path, '?');

// Depuración: Registrar la ruta extraída
file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Ruta extraída: $path\n", FILE_APPEND);

// Depuración: Registrar el método HTTP
file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Método HTTP: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

// Endpoint para buscar productos por categoría y término
if ($path === 'productos/categorias/buscar' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : 'Todos';
    $searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

    // Depuración: Registrar los parámetros recibidos
    file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Parámetros recibidos - Categoría: $category, Término de búsqueda: $searchTerm, Página: $page\n", FILE_APPEND);

    // Llamar al controlador
    $result = $productController->searchProductsByFilteredCategory($category, $searchTerm, $page);

    // Depuración: Registrar el resultado de la búsqueda
    file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Resultado de búsqueda: " . json_encode($result) . "\n", FILE_APPEND);

    // Devolver la respuesta
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}


/* Sección Usuarios */

// Rutas para autenticación
if ($path === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos POST
    $json = file_get_contents('php://input');
    $data = json_decode($json);


    if (!empty($data->email) && !empty($data->password)) {
        $result = $usuarioController->autenticar($data->email, $data->password);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Datos incompletos"
        ]);
    }
    exit;
}
if ($path === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = $usuarioController->logout();
    echo json_encode($result);
    exit;
}

// Editar Usuario
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && strpos($path, 'usuarios/editar') !== false) {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $usuarioController->editarUsuario($id);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de usuario no proporcionado']);
    }
    exit;
}

/*Sección Productos*/

//Agregar Producto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($path, 'productos/agregar') !== false) {
    $productController->agregarProducto();
    exit;
}
//Editar Producto
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && strpos($path, 'productos/editar') !== false) {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $productController->editarProducto($id);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de producto no proporcionado']);
    }
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && strpos($path, 'productos/eliminar') !== false) {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $productController->eliminarProducto($id);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de producto no proporcionado']);
    }
    exit;
}
// Obtener todos los productos
if (strpos($path, 'productos/all') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $productController->getAllProducts();
    echo json_encode($result);
    exit;
}
//Obtener productos paginados
if (strpos($path, 'productos/paginar') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $result = $productController->getPaginatedProducts($page);
    echo json_encode($result);
    exit;
}


//Buscar producto por termino de busqueda
if (strpos($path, 'productos/buscar') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $searchTerm = isset($_GET['q']) ? $_GET['q'] : '';
    $result = $productController->searchProducts($searchTerm);
    echo json_encode($result);
    exit;
}

/*Sección Categorías*/

// Mostrar categorías
if (strpos($path, 'categorias') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $categoryController->getCategories();
    echo json_encode($result);
    exit;
}

// Agregar una categoría
if (strpos($path, 'categorias/agregar') !== false && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = $categoryController->agregarCategoria();
    echo json_encode($result);
    exit;
}
// Editar una categoría
if (strpos($path, 'categorias/editar') !== false && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $result = $categoryController->editarCategoria($id);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de categoría no proporcionado']);
    }
    exit;
}
// Eliminar una categoría
if (strpos($path, 'categorias/eliminar') !== false && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $result = $categoryController->eliminarCategoria($id);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID de categoría no proporcionado']);
    }
    exit;
}
if (strpos($base_path, 'productos/categorias/buscar') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : 'Todos';
    $searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Buscando productos por categoría y término: $category, $searchTerm, página: $page\n", FILE_APPEND);
    $result = $productController->searchProductsByFilteredCategory($category, $searchTerm, $page);
    file_put_contents(__DIR__ . '/debug.log', "📌 [DEBUG] Resultado de búsqueda por categoría y término: " . json_encode($result) . "\n", FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

if (strpos($path, 'productos/categorias/paginar') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : 'Todos';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    
    $result = $productController->getPaginatedProductsByCategory($category, $page);
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

// Buscar productos por categoría
if (strpos($path, 'productos/categorias') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $result = $productController->searchProductsByCategory($category);
    echo json_encode($result);
    exit;
}

// Obtener detalles técnicos de un producto por ID
if (strpos($path, 'productos/detalles') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $productId = isset($_GET['id']) ? $_GET['id'] : null;

    if ($productId) {
        $result = $productController->getProductDetails($productId);
        echo json_encode($result);
    } else {
        echo json_encode(["error" => "ID del producto requerido"]);
    }
    exit;
}

/* Sección de formulario */

if ($path === 'enviar-formulario' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../controllers/FormController.php';
    $formController = new FormController();
    
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    
    $result = $formController->enviarFormulario($data);
    echo json_encode($result);
    exit;
}