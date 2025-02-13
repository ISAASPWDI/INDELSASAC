<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
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

// Asegurar que el path sea relativo a la API
if (strpos($request_uri, $base_path) === 0) {
    $path = trim(substr($request_uri, strlen($base_path)));
} else {
    $path = '';
}


// Rutas para autenticación
if ($path === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos POST
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    // Log de datos recibidos
    file_put_contents('login_debug.log', date('Y-m-d H:i:s') . " - Data: " . $json . "\n", FILE_APPEND);

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
// Mostrar categorías
if (strpos($path, 'categorias') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $categoryController->getCategories();
    echo json_encode($result);
    exit;
}
if (strpos($path, 'productos/categorias/buscar') === 0 && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : 'Todos';
    $searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    
    $result = $productController->searchProductsByFilteredCategory($category, $searchTerm, $page);
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
