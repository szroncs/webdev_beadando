document.addEventListener('DOMContentLoaded', async () => {
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
});
