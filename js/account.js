$(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "/api/user-info",
                success: function (response) {
                    // Assuming you have an element to display the username
                    $('#usernameDisplay').text("Hello! " + response.username);
                },
                error: function () {
                    window.location.href = 'login.html'; // Redirect to login if not authenticated
                }
            });
        });

        $('#changePasswordForm').submit(async (e) => {
            e.preventDefault();
            const currentPassword = $('#currentPassword').val();
            const newPassword = $('#newPassword').val();
            const confirmPassword = $('#confirmPassword').val();
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }
            // Send change password request to the server
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const message = await response.text();
            if (response.ok) {
                alert('Password changed successfully. Please log in with your new password.');
                window.location.href = '../pages/login.html'; // Redirect to the login page
            } else {
                alert(message); // Display error message if password change fails
            }
        });

        // Event listener for deleting account
        $('#deleteAccountButton').click(async () => {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                const response = await fetch('/delete-account', {
                    method: 'POST'
                });
                const message = await response.text();
                if (response.ok) {
                    window.location.href = '../pages/login.html'; // Redirect to login page after account deletion
                } else {
                    alert(message);
                }
            }
        });