<?php
class Categoria {
    private $conn;
    private $table = "categorias";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getCategories() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Agregar una categoría
    public function agregar($nombre) {
        $query = "INSERT INTO " . $this->table . " (nombre) VALUES (?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$nombre]);
    }

    // Editar una categoría
    public function editar($id, $nombre) {
        $query = "UPDATE " . $this->table . " SET nombre = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$nombre, $id]);
    }

    // Eliminar una categoría
    public function eliminar($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
