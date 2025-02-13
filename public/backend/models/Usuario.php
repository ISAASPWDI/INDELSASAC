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
            if (password_verify($password, $row['password'])) {  
                $this->id = $row['id'];
                $this->nombre = $row['nombre'];
                $this->email = $row['email'];
                $this->rol = $row['rol'];
                return true;
            }
        }
        return false;
    }

    // 🔹 REGISTRAR USUARIO con contraseña hasheada
    public function registrar($nombre, $email, $password, $rol) {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $query = "INSERT INTO " . $this->table . " (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$nombre, $email, $password_hash, $rol]);
    }

    // ✏️ EDITAR USUARIO (nombre, email, rol y opcionalmente la contraseña)
    public function editarUsuario($id, $nombre, $email, $rol, $password = null) {
        if ($password) {
            // Si hay nueva contraseña, se hashea antes de guardarla
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $query = "UPDATE " . $this->table . " SET nombre = ?, email = ?, rol = ?, password = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$nombre, $email, $rol, $password_hash, $id]);
        } else {
            // Si no cambia la contraseña, solo se actualizan los demás datos
            $query = "UPDATE " . $this->table . " SET nombre = ?, email = ?, rol = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$nombre, $email, $rol, $id]);
        }
    }
}
?>
