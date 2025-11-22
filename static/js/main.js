document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.getElementById('success-message');

    // Validation functions
    function isValidName(name) {
        const nameRegex = /^[A-Za-z\s]+$/;
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

        // Submit form
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        }
    });
});
