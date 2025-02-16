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
                "productos" => $result["productos"],
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
            // Verificar si se envió un formulario con datos
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                throw new Exception('Método no permitido');
            }
    
            // Obtener datos del formulario
            $nombre = $_POST['nombre'] ?? null;
            $marca = $_POST['marca'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $categorias = isset($_POST['categorias']) ? (array)$_POST['categorias'] : [];
            $detalles = json_decode($_POST['detalles'], true) ?? [];
    
            // Validar datos
            if (!$nombre || !$descripcion || empty($categorias)) {
                throw new Exception('Faltan datos requeridos');
            }
    
            // Manejo de la imagen
            $imagen = null;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
                $imagen = $this->subirImagen($_FILES['imagen']);
            } else {
                throw new Exception('Debe subir una imagen');
            }
    
            // Insertar el producto
            $resultado = $this->producto->agregar(
                $nombre,
                $descripcion,
                $marca,
                $imagen,
                $categorias,
                $detalles
            );
    
            if ($resultado) {
                echo json_encode(['status' => 'success', 'message' => 'Producto agregado correctamente']);
            } else {
                throw new Exception('No se pudo agregar el producto');
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
    }
    
    public function editarProducto($id) {
        // Asegurarnos de que siempre enviemos una respuesta JSON
        header('Content-Type: application/json');
        
        try {
            // Obtener los datos del formulario
            $putData = file_get_contents("php://input");
            $boundary = substr($putData, 0, strpos($putData, "\r\n"));
            $parts = array_slice(explode($boundary, $putData), 1, -1);
            $formData = [];
            
            foreach ($parts as $part) {
                if (empty($part)) continue;
                
                if (preg_match('/name=\"([^\"]*)\".*?(\r\n\r\n)(.*?)(\r\n)?$/s', $part, $matches)) {
                    $name = $matches[1];
                    $value = trim($matches[3]);
                    
                    if ($name === 'imagen' && strpos($part, 'filename') !== false) {
                        preg_match('/Content-Type: (.*?)\r\n\r\n(.*?)$/s', $part, $fileMatches);
                        $tmpFile = tempnam(sys_get_temp_dir(), 'upload_');
                        file_put_contents($tmpFile, $fileMatches[2]);
                        $_FILES['imagen'] = [
                            'name' => uniqid() . '.webp',
                            'type' => $fileMatches[1],
                            'tmp_name' => $tmpFile,
                            'error' => 0,
                            'size' => strlen($fileMatches[2])
                        ];
                        $formData[$name] = $_FILES['imagen'];
                    } else {
                        $formData[$name] = $value;
                    }
                }
            }
    
            // Validar y procesar los datos requeridos
            $nombre = $formData['nombre'] ?? null;
            $marca = $formData['marca'] ?? null;
            $descripcion = $formData['descripcion'] ?? null;
            $detalles = !empty($formData['detalles']) ? json_decode($formData['detalles'], true) : [];
            $imagen_actual = $formData['imagen_actual'] ?? null;
            $categorias = !empty($formData['categorias']) ? json_decode($formData['categorias'], true) : [];
    
            // Validación detallada
            $errores = [];
            if (empty($nombre)) $errores[] = "El nombre es requerido";
            if (empty($descripcion)) $errores[] = "La descripción es requerida";
            if (empty($categorias)) $errores[] = "Debe seleccionar al menos una categoría";
            if (empty($marca)) $errores[] = "La marca es requerida";
    
            if (!empty($errores)) {
                throw new Exception(implode(', ', $errores));
            }
    
            // Procesar imagen
            $imagen = $imagen_actual;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
                $imagen = $this->subirImagen($_FILES['imagen']);
                if (!$imagen) {
                    throw new Exception('Error al procesar la imagen');
                }
            }
    
            // Ejecutar la actualización
            $resultado = $this->producto->editar(
                $id,
                $nombre,
                $descripcion,
                $marca,
                $imagen,
                $categorias,
                $detalles
            );
    
            if ($resultado) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Producto actualizado correctamente'
                ]);
            } else {
                throw new Exception('Error al actualizar el producto en la base de datos');
            }
    
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
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
        try {
            // Obtener la ruta absoluta del directorio raíz del proyecto
            $base_path = realpath(dirname(dirname(dirname(__FILE__))));
            $target_dir = $base_path . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
            
            // Verificar si el directorio existe
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                throw new Exception('No se pudo crear el directorio de uploads');
            }
        }
        
        // Verificar permisos
        if (!is_writable($target_dir)) {
            throw new Exception('El directorio de uploads no tiene permisos de escritura');
        }

        // Generar nombre único
        $extension = strtolower(pathinfo($imagen["name"], PATHINFO_EXTENSION));
        $fileName = uniqid() . "." . $extension;
        $target_file = $target_dir . $fileName;

        // Intentar mover el archivo
        if (!rename($imagen["tmp_name"], $target_file)) {
            throw new Exception('No se pudo mover el archivo. Ruta: ' . $target_file);
        }

        return $fileName;
        } catch (Exception $e) {
            error_log("Error al subir imagen: " . $e->getMessage());
            throw new Exception('Error al procesar la imagen: ' . $e->getMessage());
        }
    }
    
}