async function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (container) {
    try {
      const response = await fetch("/partials/navbar.html");
      if (response.ok) {
        const html = await response.text();
        container.innerHTML = html;
      } else {
        console.error("Failed to load navbar partial:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching navbar partial:", error);
    }
  }
}

async function loadFooter() {
  const container = document.getElementById("footer-container");
  if (container) {
    try {
      const response = await fetch("/partials/footer.html");
      if (response.ok) {
        const html = await response.text();
        container.innerHTML = html;
      } else {
        console.error("Failed to load footer partial:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching footer partial:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadNavbar(), loadFooter()]);
});
