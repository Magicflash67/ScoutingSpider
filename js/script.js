// Load navbar.html into the placeholder div
fetch("InjectedHtml/navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading navbar:', error));
