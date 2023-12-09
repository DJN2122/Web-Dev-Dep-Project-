$.ajax({
    type: "GET",
    url: "/api/user-info",
    success: function (response) {
        // Assuming you have an element to display the username
        $('#usernameDisplay').text("Hello! " + response.username);
    },
    error: function () {
        window.location.href = '../pages/login.html'; // Redirect to login if not authenticated
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchQuery = document.getElementById('searchInput').value.trim();

        // Perform the AJAX request to your server's search endpoint
        fetch(`/search-criminals?name=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                // Check for too many results
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

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logOutButton');
    logoutButton.addEventListener('click', () => {
        window.location.href = '/logout'; // This calls the logout endpoint on your server
    });
});