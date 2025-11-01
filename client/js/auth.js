// client/js/auth.js

// This file handles login/signup logic and real API calls to the backend.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        // Since user creation is now HOD-controlled (POST /api/hod/signup),
        // we disable the self-signup feature on the client for all roles.
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Account creation is managed by the HOD. Please contact your department head for registration.');
        });
    }
});

// The base URL for your backend API.
// Ensure your server is running on this port.
const API_BASE_URL = 'http://localhost:5000';

/**
 * Handles the login form submission by calling the backend API.
 * UPDATED: Uses userId instead of email.
 * @param {Event} e - The form submission event.
 */
async function handleLogin(e) {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get user inputs from the form elements.
    // CHANGED: Reading login-userId instead of login-email
    const userId = document.getElementById('login-userId').value;
    const password = document.getElementById('login-password').value;

    if (!userId || !password) {
        alert('Please fill in both User ID and password.');
        return;
    }

    try {
        // Send login request to the backend
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // CHANGED: Sending userId instead of email
            body: JSON.stringify({ userId, password }),
        });

        const data = await response.json();

        // Check if the request was successful (status code 200-299)
        if (response.ok) {
            // Save token and role from the server's response to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.user.role);

            // Redirect to the correct dashboard
            //alert(data.message); // e.g., "Logged in successfully"
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