// Auth logic
const loginForm = document.querySelector('#login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        axios.post('http://localhost:3000/v1/auth/login', { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                window.location.href = 'carrera.html';
            })
            .catch(error => {
                console.error('Login failed:', error);
                alert('Login failed. Please check your credentials.');
            });
    });
}
