document.addEventListener('DOMContentLoaded', async () => {
    // --- Contact Form Handling ---
    const form = document.getElementById('contact-form');
    if (form) {
        const successMessage = document.getElementById('success-message');

        // Validation functions
        function isValidName(name) {
            const nameRegex = /^[\p{L}\s]+$/u;
            return nameRegex.test(name.trim());
        }

        function isValidPhone(phone) {
            const trimmedPhone = phone.trim();
            if (trimmedPhone === "") return true;

            const charRegex = /^[0-9\s\-+]+$/;
            const digitCount = (trimmedPhone.match(/[0-9]/g) || []).length;

            return charRegex.test(trimmedPhone) && digitCount >= 5;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.trim());
        }

        function isValidMessage(message) {
            return message.trim().length >= 10;
        }

        // Input validation handlers
        const inputs = {
            first_name: isValidName,
            last_name: isValidName,
            email: isValidEmail,
            phone_number: isValidPhone,
            message: isValidMessage
        };

        // Add blur listeners for real-time validation feedback
        Object.keys(inputs).forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;

            input.addEventListener('blur', () => {
                validateField(id, inputs[id]);
            });

            input.addEventListener('input', () => {
                // Clear error on input
                const errorEl = document.getElementById(`error-${id}`);
                if (errorEl) errorEl.classList.add('hidden');
            });
        });

        function validateField(id, validator) {
            const input = document.getElementById(id);
            const errorEl = document.getElementById(`error-${id}`);
            if (!input || !errorEl) return true;

            const isValid = validator(input.value);
            if (!isValid) {
                errorEl.classList.remove('hidden');
                input.classList.add('border-red-500');
                input.classList.remove('border-white/10');
            } else {
                errorEl.classList.add('hidden');
                input.classList.remove('border-red-500');
                input.classList.add('border-white/10');
            }
            return isValid;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isFormValid = true;
            Object.keys(inputs).forEach(id => {
                if (!validateField(id, inputs[id])) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) return;

            // Mock Submit form
            // Simulate network delay
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // --- Data Fetching for Home Page ---
    const servicesGrid = document.getElementById('services-grid');
    const servicesTableBody = document.getElementById('services-table-body');

    if (servicesGrid || servicesTableBody) {
        try {
            const response = await fetch('/data/services.json');
            if (!response.ok) throw new Error('Failed to load services');
            const services = await response.json();

            if (servicesGrid) {
                servicesGrid.innerHTML = services.map(service => `
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
                `).join('');
            }

            if (servicesTableBody) {
                servicesTableBody.innerHTML = services.map(service => `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">#${service.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-white">${service.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-primary">${service.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-white font-bold">$${service.price}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                ${service.status}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-gray-400 max-w-xs truncate" title="${service.description}">${service.description}</td>
                    </tr>
                `).join('');
            }

        } catch (error) {
            console.error('Error loading services:', error);
            if (servicesGrid) servicesGrid.innerHTML = '<p class="text-red-500">Failed to load services.</p>';
            if (servicesTableBody) servicesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-red-500 py-4">Failed to load services.</td></tr>';
        }
    }

    // Toggle Services Table
    const toggleTableBtn = document.getElementById('toggle-services-table');
    const servicesTableContainer = document.getElementById('services-table-container');

    if (toggleTableBtn && servicesTableContainer) {
        toggleTableBtn.addEventListener('click', () => {
            servicesTableContainer.classList.toggle('hidden');
            const isHidden = servicesTableContainer.classList.contains('hidden');
            const btnText = toggleTableBtn.querySelector('span');
            const btnIcon = toggleTableBtn.querySelector('svg');

            if (isHidden) {
                btnText.textContent = 'View Services Table';
                btnIcon.classList.remove('rotate-180');
            } else {
                btnText.textContent = 'Hide Services Table';
                btnIcon.classList.add('rotate-180');
            }
        });
    }

    const logoCloudGrid = document.getElementById('logo-cloud-grid');
    if (logoCloudGrid) {
        try {
            const response = await fetch('/data/logos.json');
            if (!response.ok) throw new Error('Failed to load partners');
            const logos = await response.json();

            logoCloudGrid.innerHTML = logos.map(logo => `
                <a href="/logo.html?id=${logo.id}"
                    class="group relative w-64 h-32 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-500 border border-white/10 hover:border-primary/50">
                    <div class="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                        style="background-image: url('/${logo.logo_url}');">
                    </div>
                    <div class="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                        <span class="text-white font-bold text-lg tracking-wide text-center px-2">${logo.name}</span>
                    </div>
                </a>
            `).join('');
        } catch (error) {
            console.error('Error loading partners:', error);
            logoCloudGrid.innerHTML = '<p class="text-red-500">Failed to load partners.</p>';
        }
    }

    // --- Data Fetching for Logo Detail Page ---
    const logoDetailContainer = document.getElementById('logo-detail-container');
    if (logoDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const logoId = parseInt(urlParams.get('id'));

        if (!logoId) {
            logoDetailContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Invalid Partner ID</p>';
            return;
        }

        try {
            const response = await fetch('/data/logos.json');
            if (!response.ok) throw new Error('Failed to load data');
            const logos = await response.json();
            const logo = logos.find(l => l.id === logoId);

            if (!logo) {
                logoDetailContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Partner not found</p>';
                return;
            }

            // Populate fields
            document.title = `${logo.name} - Case Study`;
            document.getElementById('logo-category').textContent = logo.category;
            document.getElementById('logo-name').textContent = logo.name;
            document.getElementById('logo-date').textContent = `Delivered: ${logo.date}`;

            const showcaseImg = document.getElementById('logo-showcase-image');
            showcaseImg.src = `/${logo.shocase_image}`; // Note: typo in JSON 'shocase_image' preserved
            showcaseImg.alt = `Showcase for ${logo.name}`;

            document.getElementById('logo-testimonial').textContent = `"${logo.testimonial_text}"`;

            const liveSiteLink = document.getElementById('logo-live-site');
            liveSiteLink.href = logo.shocase_url; // Note: typo in JSON 'shocase_url' preserved

            document.getElementById('logo-status').textContent = logo.status;
            document.getElementById('logo-category-detail').textContent = logo.category;

        } catch (error) {
            console.error('Error loading partner details:', error);
            logoDetailContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Failed to load partner details.</p>';
        }
    }
});
