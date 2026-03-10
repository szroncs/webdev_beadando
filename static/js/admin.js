document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('submissions-table-body');
    
    if (!tableBody) return;

    try {
        const response = await fetch('/api/contact-submissions');
        if (!response.ok) throw new Error('Failed to fetch submissions');
        
        const submissions = await response.json();
        
        // Sort by timestamp descending (latest on top)
        submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (submissions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">No submissions found.</td></tr>';
            return;
        }

        tableBody.innerHTML = submissions.map(sub => {
            const date = new Date(sub.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <tr class="hover:bg-white/5 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">${date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                        ${sub.first_name} ${sub.last_name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        <a href="mailto:${sub.email}" class="hover:underline">${sub.email}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        ${sub.phone_number || '-'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-300 max-w-md">
                        <div class="truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all duration-300">
                            ${sub.message}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-red-400">Error loading data: ${error.message}</td></tr>`;
    }
});
