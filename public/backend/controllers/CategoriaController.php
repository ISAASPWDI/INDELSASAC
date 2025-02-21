<?php
require_once __DIR__ . '/../models/Categoria.php';
require_once __DIR__ . '/../config/Database.php';

class CategoriaController {
    private $categoria;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->categoria = new Categoria($db);
    }

    public function getCategories() {
        return $this->categoria->getCategories();
    }
    public function agregarCategoria() {
        try {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
    
            // Log para verificar los datos recibidos
            error_log(print_r($data, true));
    
            $nombre = $data['nombre'] ?? '';

    
            if (empty($nombre)) {
                throw new Exception('Todos los campos son obligatorios');
            }
    
            $resultado = $this->categoria->agregar($nombre);
    
            if ($resultado) {
                return ['status' => 'success', 'message' => 'Categoría agregada correctamente'];
            } else {
                throw new Exception('No se pudo agregar la categoría');
            }
        } catch (Exception $e) {
            http_response_code(400);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    // Editar una categoría
    public function editarCategoria($id) {
        try {
            // Leer el cuerpo de la solicitud y decodificar el JSON
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
    
            $nombre = $data['nombre'] ?? '';
    
            if (empty($nombre)) {
                throw new Exception('Todos los campos son obligatorios');
            }
    
            $resultado = $this->categoria->editar($id, $nombre);
    
            if ($resultado) {
                return ['status' => 'success', 'message' => 'Categoría actualizada correctamente'];
            } else {
                throw new Exception('No se pudo actualizar la categoría');
            }
        } catch (Exception $e) {
            http_response_code(400);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    // Eliminar una categoría
    public function eliminarCategoria($id) {
        try {
            $resultado = $this->categoria->eliminar($id);

            if ($resultado) {
                return ['status' => 'success', 'message' => 'Categoría eliminada correctamente'];
            } else {
                throw new Exception('No se pudo eliminar la categoría');
            }
        } catch (Exception $e) {
            http_response_code(400);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
