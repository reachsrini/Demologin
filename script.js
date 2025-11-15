/**
 * Login Form Handler
 * Handles form validation, password visibility toggle, and user interaction
 */

// ============================================
// DOM ELEMENTS
// ============================================

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const successMessage = document.getElementById('successMessage');

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_-]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password requirements
 * @param {string} password - Password to validate
 * @returns {object} - Validation result and message
 */
function validatePassword(password) {
    const isValid = password.length >= 6;
    const message = password.length === 0 
        ? 'Password is required'
        : password.length < 6 
        ? 'Password must be at least 6 characters'
        : '';
    
    return { isValid, message };
}

/**
 * Validate entire form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    let isFormValid = true;

    // Validate email
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
        showError(emailInput, emailError, 'Email or username is required');
        isFormValid = false;
    } else if (!isValidEmail(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email or username');
        isFormValid = false;
    } else {
        clearError(emailInput, emailError);
    }

    // Validate password
    const passwordValue = passwordInput.value;
    const passwordValidation = validatePassword(passwordValue);
    if (!passwordValidation.isValid) {
        showError(passwordInput, passwordError, passwordValidation.message);
        isFormValid = false;
    } else {
        clearError(passwordInput, passwordError);
    }

    return isFormValid;
}

// ============================================
// ERROR HANDLING FUNCTIONS
// ============================================

/**
 * Display error message
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message text
 */
function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
}

/**
 * Clear error message
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
    togglePasswordBtn.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
    );
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Handle form submission
 * @param {Event} e - Form submission event
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');

    // Simulate API call (2 seconds)
    setTimeout(() => {
        handleLoginSuccess();
    }, 2000);
}

/**
 * Handle successful login
 */
function handleLoginSuccess() {
    // Show success message
    successMessage.classList.add('show');

    // Get form data
    const email = emailInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;

    // Store data if remember me is checked
    if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
    } else {
        localStorage.removeItem('rememberEmail');
    }

    // Log successful attempt (for demo purposes)
    console.log('Login Successful', {
        email: email,
        rememberMe: rememberMe,
        timestamp: new Date().toISOString()
    });

    // Reset form after 3 seconds
    setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        successMessage.classList.remove('show');
        loginForm.reset();
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = '👁️';
    }, 3000);
}

// ============================================
// REAL-TIME VALIDATION
// ============================================

/**
 * Validate email field on change
 */
emailInput.addEventListener('change', () => {
    const emailValue = emailInput.value.trim();
    if (emailValue && !isValidEmail(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email or username');
    } else {
        clearError(emailInput, emailError);
    }
});

/**
 * Clear email error on focus
 */
emailInput.addEventListener('focus', () => {
    if (emailError.classList.contains('show')) {
        clearError(emailInput, emailError);
    }
});

/**
 * Validate password field on change
 */
passwordInput.addEventListener('change', () => {
    const passwordValidation = validatePassword(passwordInput.value);
    if (!passwordValidation.isValid && passwordInput.value) {
        showError(passwordInput, passwordError, passwordValidation.message);
    } else {
        clearError(passwordInput, passwordError);
    }
});

/**
 * Clear password error on focus
 */
passwordInput.addEventListener('focus', () => {
    if (passwordError.classList.contains('show')) {
        clearError(passwordInput, passwordError);
    }
});

// ============================================
// EVENT LISTENERS
// ============================================

// Form submission
loginForm.addEventListener('submit', handleFormSubmit);

// Password visibility toggle
togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    togglePasswordVisibility();
});

// Clear password field on page load
window.addEventListener('load', () => {
    passwordInput.value = '';
    
    // Restore email if remember me was checked previously
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
        emailInput.value = rememberEmail;
        rememberMeCheckbox.checked = true;
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

/**
 * Handle keyboard events
 */
document.addEventListener('keydown', (e) => {
    // Submit form with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

/**
 * Enhance form for screen readers
 */
function setupAccessibility() {
    // Add aria-labels where needed
    loginBtn.setAttribute('aria-label', 'Sign in to your account');
    rememberMeCheckbox.setAttribute('aria-label', 'Remember this device');
    
    // Add form-level aria-label
    loginForm.setAttribute('aria-label', 'Login form');
}

setupAccessibility();

// ============================================
// PREVENT AUTOFILL ISSUES
// ============================================

/**
 * Handle autofill detection
 */
document.addEventListener('change', (e) => {
    if (e.target === emailInput || e.target === passwordInput) {
        // Trigger validation on autofill
        validateForm();
    }
});


