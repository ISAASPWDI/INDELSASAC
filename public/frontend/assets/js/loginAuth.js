const d = document;

export function loginAuth() {
    const passwordInput = d.getElementById('password');


    d.addEventListener('click', function(event) {

        if (event.target.matches('#togglePassword') || event.target.closest('#togglePassword')) {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const eyeIcon = event.target.querySelector('.eye-icon') || event.target.closest('#togglePassword').querySelector('.eye-icon');
            if (type === 'password') {
                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            } else {
                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            }
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const $email = d.getElementById('username').value;
        const $password = d.getElementById('password').value;
        console.log($email, $password);

        try {
            const response = await fetch('http://localhost/indelsaRepo/public/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: $email,
                    password: $password
                })
            });

            const data = await response.json(); 

            if(data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = data.redirect;
            } else {
                alert(data.message || 'Error en la autenticación');
            }
        } catch(error) {
            console.error('Error completo:', error);
            alert('Error al intentar iniciar sesión: ' + error.message);
        }
    }

    d.addEventListener('submit', handleSubmit);
}