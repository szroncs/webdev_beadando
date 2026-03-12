document.addEventListener("DOMContentLoaded", async () => {
  // --- Contact Form ---
  const form = document.getElementById("contact-form");
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan_id");
    const price = urlParams.get("price");
    const complexity = urlParams.get("complexity");

    if (planId && price && complexity) {
      const messageEl = document.getElementById("message");
      if (messageEl) {
        messageEl.value = `Project Request: ${planId}\nEstimated Price: ${price} EUR\nComplexity Score: ${complexity}/10\n\nI would like to request a formal quote for this project configuration. Additional details:\n`;
        // Reset validation visuals for pre-filled data
        const errorEl = document.getElementById(`error-message`);
        if (errorEl) errorEl.classList.add("hidden");
        messageEl.classList.remove("border-red-500");
        messageEl.classList.add("border-white/10");
      }
    }

    const successMessage = document.getElementById("success-message");

    // Validation - regex-et közbeszereztem
    function isValidName(name) {
      const nameRegex = /^[\p{L}\s]+$/u;
      return nameRegex.test(name.trim());
    }

    function isValidPhone(phone) {
      if (!phone) return true;
      const trimmedPhone = String(phone).trim();
      if (trimmedPhone === "") return true;

      const charRegex = /^[0-9\s\-+()]+$/;
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

    const inputs = {
      first_name: isValidName,
      last_name: isValidName,
      email: isValidEmail,
      phone_number: isValidPhone,
      message: isValidMessage,
    };

    // Add blur listeners for real-time validation feedback -- ezt llm tette hozzá
    Object.keys(inputs).forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener("blur", () => {
        validateField(id, inputs[id]);
      });

      input.addEventListener("input", () => {
        // Clear error on input
        const errorEl = document.getElementById(`error-${id}`);
        if (errorEl) errorEl.classList.add("hidden");
      });
    });

    function validateField(id, validator) {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(`error-${id}`);
      if (!input || !errorEl) return true;

      const isValid = validator(input.value);
      if (!isValid) {
        errorEl.classList.remove("hidden");
        input.classList.add("border-red-500");
        input.classList.remove("border-white/10");
      } else {
        errorEl.classList.add("hidden");
        input.classList.remove("border-red-500");
        input.classList.add("border-white/10");
      }
      return isValid;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(inputs).forEach((id) => {
        if (!validateField(id, inputs[id])) {
          isFormValid = false;
        }
      });

      if (!isFormValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;

      const formData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        phone_number: document.getElementById("phone_number").value,
        message: document.getElementById("message").value,
      };

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          form.classList.add("hidden");
          successMessage.classList.remove("hidden");
        } else {
          const errorEl = document.getElementById("error-message");
          errorEl.innerText = "Error sending message. Please try again later.";
          errorEl.classList.remove("hidden");
        }
      } catch (err) {
        console.error("Submission failed", err);
        const errorEl = document.getElementById("error-message");
        errorEl.innerText = "Network error. Please try again later.";
        errorEl.classList.remove("hidden");
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
