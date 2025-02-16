<?php
require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController {
    private $usuario;
    private $url_redirect = "../pages/panelDeControl.html";

    public function __construct($db) {
        $this->usuario = new Usuario($db);
    }

    public function autenticar($email, $password) {
        if(empty($email) || empty($password)) {
            return array(
                "status" => "error",
                "message" => "Todos los campos son requeridos"
            );
        }

        if($this->usuario->login($email, $password)) {
            // Crear sesión
            session_start();
            $_SESSION['user_id'] = $this->usuario->id;
            $_SESSION['user_nombre'] = $this->usuario->nombre;
            $_SESSION['user_rol'] = $this->usuario->rol;

            return array(
                "status" => "success",
                "message" => "Login exitoso",
                "user" => array(
                    "id" => $this->usuario->id,
                    "nombre" => $this->usuario->nombre,
                    "email" => $this->usuario->email,
                    "rol" => $this->usuario->rol
                ),
                "redirect" => $this->url_redirect
            );
        }

        return array(
            "status" => "error",
            "message" => "Credenciales inválidas"
        );
    }
    public function logout() {
        session_start();
        $_SESSION = array();
        
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-42000, '/');
        }
        
        session_destroy();
        
        return array(
            "status" => "success",
            "message" => "Sesión cerrada correctamente",
            "redirect" => "../pages/productos.html"
        );
    }
    public function editarUsuario($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        $usuarioActual = $this->usuario->obtenerUsuarioPorId($id);

        if (!$usuarioActual) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
            return;
        }

        $nombre = $data['nombre'] ?? $usuarioActual['nombre'];
        $email = $data['email'] ?? $usuarioActual['email'];
        $password = $data['password'] ?? $usuarioActual['password'];

        if ($nombre === $usuarioActual['nombre'] && $email === $usuarioActual['email'] && $password === $usuarioActual['password']) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'No se realizaron cambios']);
            return;
        }

        if ($this->usuario->actualizarUsuario($id, $nombre, $email, $password)) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Usuario actualizado correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el usuario']);
        }
    }
}
