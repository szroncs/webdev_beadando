document.addEventListener("DOMContentLoaded", async () => {
  const servicesGrid = document.getElementById("services-grid");
  const servicesTableBody = document.getElementById("services-table-body");

  if (servicesGrid || servicesTableBody) {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to load services");
      const services = await response.json();

      if (servicesGrid) {
        servicesGrid.innerHTML = services
          .map(
            (service) => `
                    <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-colors group/card service-card h-full flex flex-col">
                        <div class="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover/card:bg-primary transition-colors">
                            <span class="text-primary group-hover/card:text-dark font-bold text-xl">#${service.id}</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 text-white">${service.name}</h3>
                        <p class="text-gray-400 mb-6 leading-relaxed flex-grow">${service.description}</p>
                        <div class="flex justify-between items-center border-t border-white/10 pt-6 mt-auto">
                            <span class="text-sm text-primary uppercase tracking-wider">${service.category}</span>
                            <span class="text-xl font-bold text-white">$${service.price}</span>
                        </div>
                    </div>
                `,
          )
          .join("");
      }

      if (servicesTableBody) {
        servicesTableBody.innerHTML = services
          .map(
            (service) => `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">#${service.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-white">${service.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-primary">${service.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-white font-bold">$${service.price}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.status === "Available" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}">
                                ${service.status}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-gray-400 max-w-xs truncate" title="${service.description}">${service.description}</td>
                    </tr>
                `,
          )
          .join("");
      }
    } catch (error) {
      console.error("Error loading services:", error);
      if (servicesGrid)
        servicesGrid.innerHTML =
          '<p class="text-red-500">Failed to load services.</p>';
      if (servicesTableBody)
        servicesTableBody.innerHTML =
          '<tr><td colspan="6" class="text-center text-red-500 py-4">Failed to load services.</td></tr>';
    }
  }

  // Toggle Table
  const toggleTableBtn = document.getElementById("toggle-services-table");
  const servicesTableContainer = document.getElementById(
    "services-table-container",
  );

  if (toggleTableBtn && servicesTableContainer) {
    toggleTableBtn.addEventListener("click", () => {
      servicesTableContainer.classList.toggle("hidden");
      const isHidden = servicesTableContainer.classList.contains("hidden");
      const btnText = toggleTableBtn.querySelector("span");
      const btnIcon = toggleTableBtn.querySelector("svg");

      if (isHidden) {
        btnText.textContent = "View Services Table";
        btnIcon.classList.remove("rotate-180");
      } else {
        btnText.textContent = "Hide Services Table";
        btnIcon.classList.add("rotate-180");
      }
    });
  }

  const logoCloudGrid = document.getElementById("logo-cloud-grid");
  if (logoCloudGrid) {
    try {
      const response = await fetch("/api/logos");
      if (!response.ok) throw new Error("Failed to load partners");
      const logos = await response.json();

      logoCloudGrid.innerHTML = logos
        .map(
          (logo) => `
                <a href="/logo.html?id=${logo.id}"
                    class="group relative w-64 h-32 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-500 border border-white/10 hover:border-primary/50">
                    <div class="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                        style="background-image: url('/${logo.logo_url}');">
                    </div>
                    <div class="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                        <span class="text-white font-bold text-lg tracking-wide text-center px-2">${logo.name}</span>
                    </div>
                </a>
            `,
        )
        .join("");
    } catch (error) {
      console.error("Error loading partners:", error);
      logoCloudGrid.innerHTML =
        '<p class="text-red-500">Failed to load partners.</p>';
    }
  }
});
