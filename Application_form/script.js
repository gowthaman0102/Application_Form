/**
 * Job Application Form — Validation & Interaction Logic
 */
(() => {
  "use strict";

  // ── DOM References ──────────────────────────────────────────
  const form        = document.getElementById("applicationForm");
  const submitBtn   = document.getElementById("submitBtn");
  const successEl   = document.getElementById("successOverlay");
  const resetBtn    = document.getElementById("resetBtn");
  const charCount   = document.getElementById("char-count");
  const messageEl   = document.getElementById("message");

  const MAX_MESSAGE = 500;

  // ── Validation Rules ────────────────────────────────────────
  const validators = {
    name: {
      test: (v) => v.trim().length >= 2,
      message: "Name must be at least 2 characters.",
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      message: "Please enter a valid email address.",
    },
    phone: {
      test: (v) => /^[\d\s\-()+]{7,20}$/.test(v.trim()),
      message: "Enter a valid phone number (7–20 digits).",
    },
    message: {
      test: (v) => v.trim().length >= 10 && v.trim().length <= MAX_MESSAGE,
      message: `Message must be 10–${MAX_MESSAGE} characters.`,
    },
  };

  // ── Helpers ─────────────────────────────────────────────────
  function setFieldState(name, state, msg = "") {
    const group = document.getElementById(`group-${name}`);
    const error = document.getElementById(`error-${name}`);

    group.classList.remove("is-valid", "is-invalid");
    if (state === "valid")   group.classList.add("is-valid");
    if (state === "invalid") group.classList.add("is-invalid");

    error.textContent = state === "invalid" ? msg : "";
  }

  function validateField(name) {
    const input = document.getElementById(name);
    const rule  = validators[name];
    if (!rule) return true;

    const value = input.value;
    if (value.trim() === "") {
      setFieldState(name, "invalid", `This field is required.`);
      return false;
    }
    if (!rule.test(value)) {
      setFieldState(name, "invalid", rule.message);
      return false;
    }
    setFieldState(name, "valid");
    return true;
  }

  function validateAll() {
    let allValid = true;
    for (const name of Object.keys(validators)) {
      if (!validateField(name)) allValid = false;
    }
    return allValid;
  }

  // ── Character Counter ───────────────────────────────────────
  messageEl.addEventListener("input", () => {
    const len = messageEl.value.length;
    charCount.textContent = `${len} / ${MAX_MESSAGE}`;

    charCount.classList.remove("is-near-limit", "is-over-limit");
    if (len > MAX_MESSAGE)       charCount.classList.add("is-over-limit");
    else if (len > MAX_MESSAGE * 0.85) charCount.classList.add("is-near-limit");
  });

  // ── Real-Time Validation (on blur + input after first touch) ─
  const touched = {};

  Object.keys(validators).forEach((name) => {
    const input = document.getElementById(name);

    input.addEventListener("blur", () => {
      touched[name] = true;
      validateField(name);
    });

    input.addEventListener("input", () => {
      if (touched[name]) validateField(name);
      // Clear error immediately while typing
      const group = document.getElementById(`group-${name}`);
      if (group.classList.contains("is-invalid") && input.value.trim() !== "") {
        // Re-validate only if previously invalid to give instant feedback
        validateField(name);
      }
    });
  });

  // ── Submit ──────────────────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Mark all fields as touched
    Object.keys(validators).forEach((n) => (touched[n] = true));

    if (!validateAll()) {
      // Focus first invalid field
      const firstInvalid = form.querySelector(".is-invalid .form__input");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission (replace with real fetch in production)
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
      successEl.classList.add("is-visible");
    }, 1400);
  });

  // ── Reset ───────────────────────────────────────────────────
  resetBtn.addEventListener("click", () => {
    successEl.classList.remove("is-visible");
    form.reset();
    charCount.textContent = `0 / ${MAX_MESSAGE}`;
    charCount.classList.remove("is-near-limit", "is-over-limit");

    Object.keys(validators).forEach((name) => {
      setFieldState(name, "");
      touched[name] = false;
    });
  });
})();
