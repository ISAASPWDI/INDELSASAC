<?php
require_once __DIR__ . '/../models/Producto.php';
require_once __DIR__ . '/../config/Database.php';


class ProductoController {
    private $producto;
    
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->producto = new Producto($db);
    }
    public function searchProductsByCategory($category) {
        return $this->producto->searchProductsByCategory($category);
    }
    
    public function searchProducts($searchTerm) {
        return $this->producto->searchProducts($searchTerm);
    }
    public function getPaginatedProducts($page = 1) {
        try {
            $items_per_page = 25;
            $result = $this->producto->getPaginated($page, $items_per_page);
            
            return [
                "status" => "success",
                "productos" => $result["productos"],
                "currentPage" => $page,
                "totalPages" => $result["totalPages"],
                "totalProducts" => $result["totalProducts"],
                "itemsPerPage" => $items_per_page
            ];

        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Error al obtener productos: " . $e->getMessage()
            ];
        }
    }
    public function getPaginatedProductsByCategory($category, $page = 1) {
        try {
            $items_per_page = 25;
            $result = $this->producto->getPaginatedByCategory($category, $page, $items_per_page);
            
            return [
                "status" => "success",
                "productos" => $result["productos"],
                "currentPage" => $page,
                "totalPages" => $result["totalPages"],
                "totalProducts" => $result["totalProducts"],
                "itemsPerPage" => $items_per_page
            ];
    
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Error al obtener productos por categoría: " . $e->getMessage()
            ];
        }
    }
    public function searchProductsByFilteredCategory($category, $searchTerm, $page = 1) {
        try {
            $items_per_page = 25;
            $result = $this->producto->searchByFilteredCategory($category, $searchTerm, $page, $items_per_page);
            
            return [
                "status" => "success",
                "productos" => count($result["productos"]) > 0 ? $result["productos"] : ["No se encontraron resultados"],
                "currentPage" => $page,
                "totalPages" => $result["totalPages"],
                "totalProducts" => $result["totalProducts"],
                "itemsPerPage" => $items_per_page,
                "searchTerm" => $searchTerm,
                "category" => $category
            ];
    
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Error al buscar productos: " . $e->getMessage()
            ];
        }
    }
    
    public function getProductDetails($productId) {
        return $this->producto->getProductDetails($productId);
    }
    
    public function agregarProducto() {
        try {
            // Validar que sea una petición POST
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                throw new Exception('Método no permitido');
            }
            
            // Obtener datos del body
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar datos requeridos
            if (!isset($data['nombre']) || !isset($data['descripcion'])) {
                throw new Exception('Faltan datos requeridos');
            }
            
            // Manejar la imagen si existe
            $imagen = isset($_FILES['imagen']) ? $this->subirImagen($_FILES['imagen']) : null;
            
            $resultado = $this->producto->agregar(
                $data['nombre'],
                $data['descripcion'],
                $data['marca'] ?? null,
                $imagen,
                $data['detalles'] ?? []
            );
            
            http_response_code(201);
            echo json_encode(['status' => 'success', 'id' => $resultado]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    public function editarProducto($id) {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
                throw new Exception('Método no permitido');
            }
    
            // Obtener los datos del formulario
            $nombre = $_POST['nombre'] ?? null;
            $marca = $_POST['marca'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $detalles = json_decode($_POST['detalles'], true) ?? [];
            $imagen_actual = $_POST['imagen_actual'] ?? null;
    
            // Verificar si se subió una nueva imagen
            $imagen = isset($_FILES['imagen']) ? $this->subirImagen($_FILES['imagen']) : $imagen_actual;
    
            // Validar datos requeridos
            if (!$nombre || !$descripcion) {
                throw new Exception('Faltan datos requeridos');
            }
    
            // Llamar al método editar del modelo
            $resultado = $this->producto->editar(
                $id,
                $nombre,
                $descripcion,
                $marca,
                $imagen,
                $detalles
            );
    
            echo json_encode(['status' => 'success']);
    
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    public function eliminarProducto($id) {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
                throw new Exception('Método no permitido');
            }
            
            $resultado = $this->producto->eliminar($id);
            
            if ($resultado) {
                echo json_encode(['status' => 'success']);
            } else {
                throw new Exception('No se pudo eliminar el producto');
            }
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    private function subirImagen($imagen) { 
        $target_dir = __DIR__ . "/../uploads/";
        $fileName = uniqid() . "_" . basename($imagen["name"]);
        $target_file = $target_dir . $fileName;
    
        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            return $fileName;
        }
        throw new Exception('Error al subir la imagen');
    }
    
}