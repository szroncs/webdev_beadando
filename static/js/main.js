async function loadNavbar() {
    const container = document.getElementById('navbar-container');
    if (container) {
        try {
            const response = await fetch('/static/partials/navbar.html');
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
    await loadNavbar();
    // --- Contact Form Handling ---
    const form = document.getElementById('contact-form');
    if (form) {
        // Pre-fill from query params if coming from Planner
        const urlParams = new URLSearchParams(window.location.search);
        const planId = urlParams.get('plan_id');
        const price = urlParams.get('price');
        const complexity = urlParams.get('complexity');
        
        if (planId && price && complexity) {
            const messageEl = document.getElementById('message');
            if (messageEl) {
                messageEl.value = `Project Request: ${planId}\nEstimated Price: ${price} EUR\nComplexity Score: ${complexity}/10\n\nI would like to request a formal quote for this project configuration. Additional details:\n`;
                // Reset validation visuals for pre-filled data
                const errorEl = document.getElementById(`error-message`);
                if (errorEl) errorEl.classList.add('hidden');
                messageEl.classList.remove('border-red-500');
                messageEl.classList.add('border-white/10');
            }
        }

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

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                phone_number: document.getElementById('phone_number').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                } else {
                    const errorEl = document.getElementById('error-message');
                    errorEl.innerText = "Error sending message. Please try again later.";
                    errorEl.classList.remove('hidden');
                }
            } catch (err) {
                console.error("Submission failed", err);
                const errorEl = document.getElementById('error-message');
                errorEl.innerText = "Network error. Please try again later.";
                errorEl.classList.remove('hidden');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Planner Logic ---
    const plannerContainer = document.getElementById('planner');
    if (plannerContainer) {
        const rowsContainer = document.getElementById('planner-rows-container');
        const addRowBtn = document.getElementById('planner-add-row');
        const totalPriceEl = document.getElementById('planner-total');
        const complexityEl = document.getElementById('planner-complexity');
        const submitBtn = document.getElementById('planner-submit');
        
        let components = [];
        let rows = [
            { id: Date.now(), componentId: 'main_page', note: '' }
        ];

        // Fetch components
        try {
            const response = await fetch('/api/planner-components');
            if (response.ok) {
                components = await response.json();
                renderPlanner();
            } else {
                console.error('Failed to load planner components');
                rowsContainer.innerHTML = '<p class="text-red-500 p-4">Failed to load components. Please ensure server is running.</p>';
            }
        } catch (error) {
            console.error('Error fetching planner components:', error);
            rowsContainer.innerHTML = '<p class="text-red-500 p-4">Error fetching planner components.</p>';
        }

        function renderPlanner() {
            if (!components.length) return;

            rowsContainer.innerHTML = rows.map((row, index) => {
                const selectedComponent = components.find(c => c.id === row.componentId) || components[0];
                const price = selectedComponent.price;

                return `
                    <div class="bg-dark/50 border border-white/10 rounded-2xl p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center relative group planner-row" data-row-id="${row.id}">
                        <!-- Mobile labels (hidden on desktop) -->
                        <div class="col-span-4 w-full">
                            <label class="md:hidden text-xs text-gray-400 uppercase tracking-wider mb-1 block">Component</label>
                            <div class="relative">
                                <select class="component-select w-full bg-dark border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                                    ${components.map(c => `<option value="${c.id}" ${c.id === row.componentId ? 'selected' : ''}>${c.name}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-span-2 w-full md:text-right">
                            <label class="md:hidden text-xs text-gray-400 uppercase tracking-wider mb-1 block">Price</label>
                            <span class="text-white font-bold inline-block py-2">${price} EUR</span>
                        </div>
                        
                        <div class="col-span-5 w-full">
                            <label class="md:hidden text-xs text-gray-400 uppercase tracking-wider mb-1 block">Notes</label>
                            <input type="text" maxlength="255" class="row-note w-full bg-dark border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary placeholder-gray-600 transition-colors" placeholder="Section name, title, or note..." value="${row.note}">
                        </div>
                        
                        <div class="col-span-1 w-full flex justify-end md:justify-center">
                            ${rows.length > 1 ? `
                                <button class="remove-row-btn p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors border border-transparent hover:border-secondary/20" title="Remove Component">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            ` : `<div class="w-9 h-9"></div><!-- Placeholder for alignment -->`}
                        </div>
                    </div>
                `;
            }).join('');

            // Attach listeners to newly rendered rows
            document.querySelectorAll('.planner-row').forEach(rowEl => {
                const rowId = parseInt(rowEl.dataset.rowId);
                const selectEl = rowEl.querySelector('.component-select');
                const noteEl = rowEl.querySelector('.row-note');
                const removeBtn = rowEl.querySelector('.remove-row-btn');

                selectEl.addEventListener('change', (e) => {
                    const row = rows.find(r => r.id === rowId);
                    if (row) row.componentId = e.target.value;
                    updateTotals();
                    renderPlanner(); // re-render to update price display inline
                });

                noteEl.addEventListener('input', (e) => {
                    const row = rows.find(r => r.id === rowId);
                    if (row) row.note = e.target.value;
                });

                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        rows = rows.filter(r => r.id !== rowId);
                        renderPlanner();
                        updateTotals();
                    });
                }
            });

            updateTotals();
        }

        function updateTotals() {
            let total = 0;
            rows.forEach(row => {
                const comp = components.find(c => c.id === row.componentId) || components[0];
                if (comp) total += comp.price;
            });
            
            const complexity = Math.min(10, Math.ceil(rows.length / 2));

            // Animate number change if possible or just update
            totalPriceEl.textContent = total;
            complexityEl.textContent = complexity;
        }

        addRowBtn.addEventListener('click', () => {
            rows.push({ id: Date.now(), componentId: 'main_page', note: '' });
            renderPlanner();
        });

        submitBtn.addEventListener('click', () => {
            const planId = `PLAN-${Date.now().toString(36).toUpperCase()}`;
            const total = totalPriceEl.textContent;
            const complexity = complexityEl.textContent;
            
            // Redirect to contact page
            window.location.href = `/contact.html?plan_id=${planId}&price=${total}&complexity=${complexity}`;
        });
    }

    // --- Data Fetching for Home Page ---
    const servicesGrid = document.getElementById('services-grid');
    const servicesTableBody = document.getElementById('services-table-body');

    if (servicesGrid || servicesTableBody) {
        try {
            const response = await fetch('/api/services');
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
            const response = await fetch('/api/logos');
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
            const response = await fetch('/api/logos');
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
