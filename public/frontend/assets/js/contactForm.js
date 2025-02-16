export function contactForm() {
    const d = document;
    const validarFormulario = () => {
        const $form = d.getElementById('contactForm');

        
        if (!$form) return;

        // Expresiones regulares para validación
        const regex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            telefono: /^[0-9]{9,15}$/,
            nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
        };

        // Elementos del formulario
        const campos = {
            empresa: $form.querySelector('[placeholder="Empresa:"]'),
            nombre: $form.querySelector('[placeholder="Nombre:"]'),
            apellido: $form.querySelector('[placeholder="Apellido:"]'),
            telefono: $form.querySelector('[placeholder="Teléfono:"]'),
            servicio: $form.querySelector('[placeholder="Selecciona un servicio: "]'),
            email: $form.querySelector('[placeholder="Email:"]'),
            mensaje: $form.querySelector('[placeholder="Mensaje:"]')
        };

        // Función para mostrar errores
        const showError = (input, message) => {
            const formGroup = input.closest('.col-12, .col-md-6, .col-sm-6');
            let errorElement = formGroup.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = d.createElement('div');
                errorElement.className = 'error-message text-danger mt-1 small';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('is-invalid');
        };

        // Función para limpiar errores
        const clearError = (input) => {
            const formGroup = input.closest('.col-12, .col-md-6, .col-sm-6');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) errorElement.remove();
            input.classList.remove('is-invalid');
        };

        // Validación en tiempo real
        Object.values(campos).forEach(input => {
            input.addEventListener('input', function() {
                clearError(this);
            });
        });

        // Manejar envío del formulario
        $form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;

            // Validar campos
            Object.entries(campos).forEach(([key, input]) => {
                clearError(input);
                const value = input.value.trim();

                if (!value) {
                    showError(input, 'Este campo es requerido');
                    isValid = false;
                    return;
                }

                switch(key) {
                    case 'email':
                        if (!regex.email.test(value)) {
                            showError(input, 'Ingrese un correo válido');
                            isValid = false;
                        }
                        break;
                    
                    case 'telefono':
                        if (!regex.telefono.test(value)) {
                            showError(input, 'Teléfono inválido (9-15 dígitos)');
                            isValid = false;
                        }
                        break;
                    
                    case 'nombre':
                    case 'apellido':
                        if (!regex.nombre.test(value)) {
                            showError(input, 'Mínimo 2 caracteres, solo letras');
                            isValid = false;
                        }
                        break;
                    
                    case 'mensaje':
                        if (value.length < 10) {
                            showError(input, 'El mensaje debe tener al menos 10 caracteres');
                            isValid = false;
                        }
                        break;
                }
            });

            // Validación adicional para empresa
            if (campos.empresa.value.trim().length < 2) {
                showError(campos.empresa, 'Nombre de empresa inválido');
                isValid = false;
            }

            if (!isValid) return;

            // Configurar estado de carga
            const btnEnviar = $form.querySelector('.btn-enviar-solicitud');
            const originalContent = btnEnviar.innerHTML;
            btnEnviar.disabled = true;
            btnEnviar.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status"></span>
                Enviando...
            `;

            try {
                const formData = {
                    empresa: campos.empresa.value.trim(),
                    nombre: campos.nombre.value.trim(),
                    apellido: campos.apellido.value.trim(),
                    telefono: campos.telefono.value.trim(),
                    servicio: campos.servicio.value.trim(),
                    email: campos.email.value.trim(),
                    mensaje: campos.mensaje.value.trim()
                };
                console.log(formData);
                
                // Enviar datos al backend
                const response = await fetch('http://localhost/indelsaRepo/public/api/enviar-formulario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (result.status === 'success') {
                    // Mostrar alerta de éxito
                    const successAlert = `
                        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                            ¡Solicitud enviada con éxito!
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                    $form.insertAdjacentHTML('afterbegin', successAlert);
                    $form.reset();
                } else {
                    throw new Error(result.message || 'Error en el servidor');
                }
            } catch (error) {
                const errorAlert = `
                    <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                $form.insertAdjacentHTML('afterbegin', errorAlert);
            } finally {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = originalContent;
            }
        });
    };
        validarFormulario();

}