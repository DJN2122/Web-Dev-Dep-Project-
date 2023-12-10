// Session Validation
$.ajax({
    type: "GET",
    url: "/api/user-info",
    success: function (response) {
        // No action required on success
    },
    error: function () {
        window.location.href = '../pages/login.html'; // Redirect to login if not authenticated
    }
});

// Event Listener for name search
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchQuery = document.getElementById('searchInput').value.trim();

        // Perform the AJAX request
        fetch(`/search-criminals?name=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            // Check for too many results (100+)
            if (data.message) {
                alert(data.message);
            } else {
                // Store the results in local storage and redirect to results.html
                localStorage.setItem('searchResults', JSON.stringify(data));
                window.location.href = '../pages/results.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while searching.');
        });
    });
});

function goToAccountSettings() {
    window.location.href = '../pages/account.html'; // Redirect to the account page
}

// Event Listener for logging out
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logOutButton');
    logoutButton.addEventListener('click', () => {
        window.location.href = '/logout'; // This calls the logout endpoint
    });
});