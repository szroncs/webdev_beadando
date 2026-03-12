document.addEventListener("DOMContentLoaded", async () => {
  const logoDetailContainer = document.getElementById("logo-detail-container");
  if (logoDetailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const logoId = parseInt(urlParams.get("id"));

    if (!logoId) {
      logoDetailContainer.innerHTML =
        '<p class="text-center text-red-500 text-xl">Invalid Partner ID</p>';
      return;
    }

    try {
      const response = await fetch("/api/logos");
      if (!response.ok) throw new Error("Failed to load data");
      const logos = await response.json();
      const logo = logos.find((l) => l.id === logoId);

      if (!logo) {
        logoDetailContainer.innerHTML =
          '<p class="text-center text-red-500 text-xl">Partner not found</p>';
        return;
      }

      document.title = `${logo.name} - Case Study`;
      document.getElementById("logo-category").textContent = logo.category;
      document.getElementById("logo-name").textContent = logo.name;
      document.getElementById("logo-date").textContent =
        `Delivered: ${logo.date}`;

      const showcaseImg = document.getElementById("logo-showcase-image");
      showcaseImg.src = `/${logo.shocase_image}`; // Note: typo in JSON 'shocase_image' preserved
      showcaseImg.alt = `Showcase for ${logo.name}`;

      document.getElementById("logo-testimonial").textContent =
        `"${logo.testimonial_text}"`;

      const liveSiteLink = document.getElementById("logo-live-site");
      liveSiteLink.href = logo.shocase_url; // Note: typo in JSON 'shocase_url' preserved

      document.getElementById("logo-status").textContent = logo.status;
      document.getElementById("logo-category-detail").textContent =
        logo.category;
    } catch (error) {
      console.error("Error loading partner details:", error);
      logoDetailContainer.innerHTML =
        '<p class="text-center text-red-500 text-xl">Failed to load partner details.</p>';
    }
  }
});
