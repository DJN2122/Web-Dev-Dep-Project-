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

// Event Listener once name is searched
document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.querySelector('.card-container');
    const results = JSON.parse(localStorage.getItem('searchResults'));

    // Clear the local storage
    localStorage.removeItem('searchResults');

    // Check if there are results
    if (results && results.length > 0) {
        resultsContainer.innerHTML = results.map(criminal => `
            <div class="card">
                <h2>${criminal.Name}</h2>
                <p>Age: ${criminal.Age}</p>
                <p>Race: ${criminal.Race}</p>
                <p>Crime: ${criminal.Crime}</p>
                <p>Crime Date: ${new Date(criminal['Crime Date']).toLocaleDateString()}</p>
                <p>Conviction Date: ${new Date(criminal['Conviction Date']).toLocaleDateString()}</p>
                <p>Release Date: ${new Date(criminal['Release Date']).toLocaleDateString()}</p>
                <p>Status: ${criminal.Status}</p>
                <p>Last Known Location: ${criminal['Last Known Location']}</p>
                <p>Risk Level: ${criminal['Risk Level']}</p>
                <p>Wanted: ${criminal.Wanted}</p>
            </div>
        `).join('');
    } else {
        resultsContainer.innerHTML = '<p>No criminals found with that name.</p>';
    }
});

function searchDatabase() {
    window.location.href = '../pages/search.html'; // Redirect to the search page
}