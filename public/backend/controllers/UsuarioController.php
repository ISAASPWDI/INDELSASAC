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
}
?>