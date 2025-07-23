// This file will handle login/signup logic and API calls.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

/**
 * Handles the login form submission.
 * @param {Event} e - The form submission event.
 */
async function handleLogin(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    console.log('Login form submitted');

    // Get the role from the hidden input field in the form.
    const roleInput = document.getElementById('login-role');
    
    if (!roleInput) {
        alert('Error: Role input field is missing from the login form.');
        return;
    }

    const userRole = roleInput.value;
    
    // --- SIMULATION ---
    // In a real app, you would send the email and password to your backend API.
    // const email = document.getElementById('login-email').value;
    // const password = document.getElementById('login-password').value;
    // The backend would verify the user and return a token and role.

    const fakeToken = `fake-jwt-token-for-${userRole}`;

    // Save token and role to localStorage to persist the session.
    localStorage.setItem('authToken', fakeToken);
    localStorage.setItem('userRole', userRole);

    // Redirect to the correct dashboard, adding a flag to the URL.
    alert(`Simulating successful login for ${userRole}. Redirecting...`);
    window.location.href = `${userRole}-dashboard.html?fromLogin=true`;
}


/**
 * Handles the signup form submission.
 * @param {Event} e - The form submission event.
 */
async function handleSignup(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user details from the signup form
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const roleInput = document.getElementById('login-role'); // Get role from the hidden input
    const role = roleInput ? roleInput.value : null;

    if (!name || !email || !password || !role) {
        alert('Please fill out all fields to sign up.');
        return;
    }

    // --- SIMULATION of sending data to the backend ---
    console.log('--- Signup Data to be sent to backend ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('-----------------------------------------');

    // In a real application, you would make a fetch call to your signup API endpoint here.
    // For example:
    // const response = await fetch('/api/auth/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password, role }),
    // });
    // const data = await response.json();
    // if (response.ok) { ... }

    // Show a success message and redirect to the login form
    alert('Signup successful! You will now be redirected to the login page.');
    
    // This reloads the current page (e.g., student.html), which is what we want.
    // It will default back to the login tab.
    window.location.reload();
}
