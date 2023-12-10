// Event Listener for log in
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.text();
        if (response.ok) {
            window.location.href = '../pages/search.html';
        } else {
            alert(data);
        }
    } catch (error) {
        console.error('Login failed', error);
    }
});