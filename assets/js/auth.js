// API Base Configuration
const API_BASE_URL = window.location.origin + '/api';

// Authentication utilities
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.listeners = [];
    }

    // Event system for authentication state changes
    addEventListener(listener) {
        this.listeners.push(listener);
    }

    removeEventListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.isAuthenticated(), this.user));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Get auth token
    getToken() {
        return this.token;
    }

    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                this.notifyListeners();
                return { success: true, user: this.user };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                this.notifyListeners();
                return { success: true, user: this.user };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.notifyListeners();
        
        // Redirect to home page
        if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/admin')) {
            window.location.href = '/';
        }
    }

    // Check if user has specific role
    hasRole(role) {
        return this.user && this.user.role === role;
    }

    // Check if user has any of the roles
    hasAnyRole(roles) {
        return this.user && roles.includes(this.user.role);
    }

    // Refresh user profile
    async refreshProfile() {
        if (!this.token) return;

        try {
            const response = await this.makeAuthenticatedRequest('/auth/profile');
            if (response.success) {
                this.user = response.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Profile refresh error:', error);
            this.logout();
        }
    }

    // Make authenticated API request
    async makeAuthenticatedRequest(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                ...options.headers
            }
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Authentication required');
        }

        return await response.json();
    }
}

// API Client
class APIClient {
    constructor(authManager) {
        this.auth = authManager;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };

        // Add auth header if authenticated
        if (this.auth.isAuthenticated()) {
            config.headers.Authorization = `Bearer ${this.auth.getToken()}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            this.auth.logout();
            throw new Error('Authentication required');
        }

        return await response.json();
    }

    // Prayer requests
    async getPrayers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/prayers?${queryString}`);
    }

    async submitPrayer(prayerData) {
        return await this.request('/prayers', {
            method: 'POST',
            body: JSON.stringify(prayerData)
        });
    }

    async prayForRequest(prayerId, message = '') {
        return await this.request(`/prayers/${prayerId}/pray`, {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }

    // Events
    async getEvents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/events?${queryString}`);
    }

    async getEvent(id) {
        return await this.request(`/events/${id}`);
    }

    async registerForEvent(eventId) {
        return await this.request(`/events/${eventId}/register`, {
            method: 'POST'
        });
    }

    // Dashboard
    async getDashboardStats() {
        return await this.request('/dashboard/stats');
    }

    async getMyPrayers() {
        return await this.request('/prayers/my-prayers');
    }

    async getMyEvents() {
        return await this.request('/events/my-events');
    }

    async updateProfile(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Blog posts
    async getBlogPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/blog?${queryString}`);
    }

    // Sermons
    async getSermons(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/sermons?${queryString}`);
    }

    // Donations
    async createDonation(donationData) {
        return await this.request('/donations', {
            method: 'POST',
            body: JSON.stringify(donationData)
        });
    }

    // Contact
    async submitContact(contactData) {
        return await this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }
}

// Initialize global instances
const authManager = new AuthManager();
const apiClient = new APIClient(authManager);

// Global utilities
const Utils = {
    // Format date
    formatDate(date, options = {}) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        });
    },

    // Format time
    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-xl font-bold">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    // Loading state management
    setLoading(element, loading = true) {
        if (loading) {
            element.disabled = true;
            element.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
        } else {
            element.disabled = false;
            element.innerHTML = element.dataset.originalText || 'Submit';
        }
    },

    // Truncate text
    truncateText(text, length = 100) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Auth state management for UI
authManager.addEventListener((isAuthenticated, user) => {
    // Update navigation
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');

    if (isAuthenticated && user) {
        // Show user menu, hide auth buttons
        if (authButtons) authButtons.classList.add('hidden');
        if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            userMenu.querySelector('.user-name').textContent = user.firstName + ' ' + user.lastName;
            userMenu.querySelector('.user-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        }

        // Update dashboard links based on role
        const dashboardLinks = document.querySelectorAll('.dashboard-link');
        dashboardLinks.forEach(link => {
            if (user.role === 'admin') {
                link.href = '/admin';
                link.textContent = 'Admin Panel';
            } else {
                link.href = '/dashboard';
                link.textContent = 'My Dashboard';
            }
        });
    } else {
        // Show auth buttons, hide user menu
        if (authButtons) authButtons.classList.remove('hidden');
        if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
});

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    authManager.notifyListeners();
    
    // Check token validity
    if (authManager.isAuthenticated()) {
        authManager.refreshProfile().catch(() => {
            console.log('Token expired or invalid, logging out');
        });
    }
});

// Make available globally
window.authManager = authManager;
window.apiClient = apiClient;
window.Utils = Utils;
