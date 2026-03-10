async function loadNavbar() {
    const container = document.getElementById('navbar-container');
    if (container) {
        try {
            const response = await fetch('/partials/navbar.html');
            if (response.ok) {
                const html = await response.text();
                container.innerHTML = html;
            } else {
                console.error('Failed to load navbar partial:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching navbar partial:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load global components
    await loadNavbar();
});
