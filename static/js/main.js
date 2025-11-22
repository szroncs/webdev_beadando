document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

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

    // Carousel Logic
    function initCarousel() {
        const carousel = document.getElementById('services-carousel');
        if (!carousel) return;

        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        const cards = carousel.querySelectorAll('.service-card');

        if (cards.length === 0) return;

        let autoScrollInterval;

        const getScrollAmount = () => {
            return cards[0].offsetWidth + 24; // Width + gap (gap-6 is 1.5rem = 24px)
        };

        // Create indicators
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-all ${index === 0 ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'}`;
            dot.ariaLabel = `Go to slide ${index + 1}`;
            dot.addEventListener('click', () => {
                carousel.scrollTo({
                    left: index * getScrollAmount(),
                    behavior: 'smooth'
                });
                resetAutoScroll();
            });
            indicatorsContainer.appendChild(dot);
        });

        const updateIndicators = () => {
            const scrollPos = carousel.scrollLeft;
            const index = Math.round(scrollPos / getScrollAmount());

            Array.from(indicatorsContainer.children).forEach((dot, i) => {
                if (i === index) {
                    dot.className = 'w-3 h-3 rounded-full transition-all bg-primary w-8';
                } else {
                    dot.className = 'w-3 h-3 rounded-full transition-all bg-white/20 hover:bg-white/40';
                }
            });
        };

        carousel.addEventListener('scroll', () => {
            // Debounce indicator update for performance if needed, but direct is fine for small items
            updateIndicators();
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                resetAutoScroll();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                resetAutoScroll();
            });
        }

        // Auto-scroll
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                if (carousel.scrollLeft >= maxScroll - 10) { // Tolerance
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                }
            }, 3000); // 3 seconds
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }

        function resetAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }

        // Pause on hover
        carousel.parentElement.addEventListener('mouseenter', stopAutoScroll);
        carousel.parentElement.addEventListener('mouseleave', startAutoScroll);

        // Start initial auto-scroll
        startAutoScroll();
    }

    initCarousel();
});
