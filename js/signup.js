document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            try {
                // Send a request to the server
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.text();
                if (response.ok) {
                    alert('Account created successfully. Please log in.');
                    window.location.href = '../pages/login.html';
                } else {
                    alert(data); // Show error message from server
                }
            } catch (error) {
                console.error('Signup failed', error);
                alert('An error occurred during signup.');
            }
        });