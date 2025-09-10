
const registerForm = document.querySelector('#register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm.username.value;
        const password = registerForm.password.value;
        const confirmPassword = registerForm['confirm-password'].value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        axios.post('http://localhost:3000/v1/auth/register', { username, password, confirmPassword })
            .then(response => {
                // Assuming the register endpoint also returns a token
                localStorage.setItem('token', response.data.token);
                window.location.href = 'carrera.html';
            })
            .catch(error => {
                console.error('Registration failed:', error);
                alert('Registration failed. Please try again.');
            });
    });
}