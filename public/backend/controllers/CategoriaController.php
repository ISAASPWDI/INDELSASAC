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
}
