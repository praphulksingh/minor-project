// This file handles login/signup logic and real API calls to the backend.

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

// The base URL for your backend API.
// Ensure your server is running on this port.
const API_BASE_URL = 'http://localhost:5000';

/**
 * Handles the login form submission by calling the backend API.
 * @param {Event} e - The form submission event.
 */
async function handleLogin(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user inputs from the form elements.
    // Ensure your HTML has <input id="login-email"> and <input id="login-password">.
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    try {
        // Send login request to the backend
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Check if the request was successful (status code 200-299)
        if (response.ok) {
            // Save token and role from the server's response to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.user.role);

            // Redirect to the correct dashboard
            alert(data.message); // e.g., "Logged in successfully"
            window.location.href = `${data.user.role}-dashboard.html?fromLogin=true`;
        } else {
            // Show a specific error message from the server
            alert(`Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Login Error:', error);
        alert('An error occurred. Could not connect to the server. Please ensure the server is running.');
    }
}


/**
 * Handles the signup form submission by calling the backend API.
 * @param {Event} e - The form submission event.
 */
async function handleSignup(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user details from the signup form.
    // Ensure your HTML has the correct IDs for each input.
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value; // Ensure your <select> has id="signup-role"

    if (!name || !email || !password || !role) {
        alert('Please fill out all fields to sign up.');
        return;
    }

    try {
        // Send signup request to the backend
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful! Please log in to continue.');
            // Reload the page to clear the form and switch to the login tab
            window.location.reload();
        } else {
            // Show a specific error message from the server (e.g., "User already exists")
            alert(`Signup Failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Signup Error:', error);
        alert('An error occurred. Could not connect to the server. Please ensure the server is running.');
    }
}
