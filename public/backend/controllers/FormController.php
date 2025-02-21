<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../../../vendor/autoload.php'; // Si usas Composer para PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class FormController
{
    private $db;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function enviarFormulario($data)
    {
        // Validar y sanitizar datos
        $empresa = htmlspecialchars(strip_tags($data->empresa));
        $nombre = htmlspecialchars(strip_tags($data->nombre));
        $apellido = htmlspecialchars(strip_tags($data->apellido));
        $telefono = htmlspecialchars(strip_tags($data->telefono));
        $servicio = htmlspecialchars(strip_tags($data->servicio));
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $mensaje = htmlspecialchars(strip_tags($data->mensaje));

        // Configurar PHPMailer
        $mail = new PHPMailer(true);

        try {
            $mail->CharSet = 'UTF-8'; // Añadir encoding
            $mail->Encoding = 'base64';
            // Configuración SMTP
            $mail->isSMTP();
            $mail->Host = 'sandbox.smtp.mailtrap.io';
            $mail->SMTPAuth = true;
            $mail->Username = '2aae336a319f53';
            $mail->Password = '1ddc798d357096';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 2525;

            // Destinatarios
            $mail->setFrom('no-reply@indelsa.com', 'INDELSA');
            //asesor de indelsa
            $mail->addAddress('stivensaliaga@gmail.com', 'Soy ADMIN');

            // Contenido
            $mail->isHTML(true);
            $mail->Subject = 'Nueva solicitud de contacto';
            $mail->Body = "
<!DOCTYPE html>
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
        }
        .header {
            background-color: #2c3e50;
            color: #ffffff;
            padding: 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            padding: 30px;
            background-color: #f8f9fa;
            border-radius: 0 0 5px 5px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        /* Primera columna (etiquetas) sin quiebre de línea */
        .data-table td:first-child {
            width: 30%;
            font-weight: 600;
            color: #2c3e50;
            white-space: nowrap; /* No se rompe aquí */
        }
        /* Segunda columna (valores) sí permite quiebre */
        .data-table td:nth-child(2) {
            word-break: break-word;
            white-space: normal;
        }
        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            vertical-align: top;
            overflow-wrap: anywhere; /* Para cortar palabras muy largas */
        }

        .message-box {
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        /* Forzamos el wrap dentro del mensaje */
        .message-box p {
            line-height: 1.6;
            color: #495057;
            word-break: break-word; 
            white-space: normal;
            overflow-wrap: anywhere;
        }

        p {
            margin: 0;
        }

        /* --- Ajustes para móviles --- */
        @media screen and (max-width: 600px) {
            .content {
                padding: 15px;
            }

            /* Apilamos cada fila (tr) y mostramos cada celda (td) en bloque */
            .data-table tr {
                display: block;
                margin-bottom: 10px;
            }
            .data-table td {
                display: block;
                width: 100%;
                box-sizing: border-box;
                border-bottom: none; /* Opcional, para eliminar la línea entre celdas */
            }
            .data-table td:first-child {
                font-weight: bold;
                color: #2c3e50;
            }
            .data-table td:nth-child(2) {
                margin-top: 5px;
                font-weight: normal;
            }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h2 style='margin: 0; font-weight: 300;'>Nueva solicitud de contacto</h2>
        </div>
        <div class='content'>
            <table class='data-table'>
                <tr>
                    <td>Empresa:</td>
                    <td>$empresa</td>
                </tr>
                <tr>
                    <td>Nombre completo:</td>
                    <td>$nombre $apellido</td>
                </tr>
                <tr>
                    <td>Teléfono:</td>
                    <td>$telefono</td>
                </tr>
                <tr>
                    <td>Servicio solicitado:</td>
                    <td>$servicio</td>
                </tr>
                <tr>
                    <td>Correo electrónico:</td>
                    <td>$email</td>
                </tr>
            </table>

            <div class='message-box'>
                <h3 style='color: #2c3e50; margin-top: 0;'>Mensaje del cliente:</h3>
                <p>$mensaje</p>
            </div>

            <p style='color: #6c757d; font-size: 0.9em; margin-top: 25px;'>
                Este mensaje fue generado automáticamente desde el formulario de contacto de INDELSA.
            </p>
        </div>
    </div>
</body>
</html>
";





            $mail->send();
            error_log('Intento de envío: ' . date('Y-m-d H:i:s'));
            error_log('Datos recibidos: ' . print_r($data, true));
            return ['status' => 'success', 'message' => 'Solicitud enviada correctamente'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => 'Error al enviar: ' . $mail->ErrorInfo];
        }
    }
}
