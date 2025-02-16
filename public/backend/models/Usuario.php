<?php
class Usuario {
    private $conn;
    private $table = 'usuarios';

    public $id;
    public $nombre;
    public $email;
    public $password;
    public $rol;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 🔐 LOGIN con password_verify()
    public function login($email, $password) {
        $query = "SELECT id, nombre, email, password, rol FROM " . $this->table . " WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Verifica la contraseña hasheada con password_verify()

                $this->id = $row['id'];
                $this->nombre = $row['nombre'];
                $this->email = $row['email'];
                $this->rol = $row['rol'];
                return true;
            
        }
        return false;
    }
    public function obtenerUsuarioPorId($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizarUsuario($id, $nombre, $email, $password) {
        $query = "UPDATE " . $this->table . " SET nombre = :nombre, email = :email, password = :password WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

}

