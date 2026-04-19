// Session and Authentication Manager
class SessionManager {
    constructor() {
        this.baseURL = 'http://localhost:4000/api/v1';
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        this.isInitialized = false;
        
        // Don't check auth immediately, wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
            });
        } else {
            // DOM already loaded
            setTimeout(() => this.initialize(), 100);
        }
    }

    // Initialize session manager
    initialize() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        // Only check auth if we're not on login page
        if (!window.location.pathname.includes('login.html')) {
            this.checkAuthOnLoad();
        }
    }

    // Check authentication on page load
    checkAuthOnLoad() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return;
        }
        
        // Simple token validation - just check if it exists and is not expired
        if (this.isTokenExpired()) {
            this.logout();
            return;
        }
        
        // Update UI immediately
        this.updateUserInfo();
        
        // Verify token with server in background (non-blocking)
        this.verifyTokenInBackground();
    }

    // Check if token is expired (client-side check)
    isTokenExpired() {
        if (!this.token) return true;
        
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    }

    // Verify token with server in background
    async verifyTokenInBackground() {
        try {
            const response = await fetch(`${this.baseURL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                console.warn('Token verification failed, but continuing with session');
                // Don't logout immediately, let user continue
            }
        } catch (error) {
            console.warn('Token verification request failed:', error);
            // Don't logout on network errors
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.token && this.currentUser.id && !this.isTokenExpired());
    }

    // Verify token with server (used for manual verification)
    async verifyToken() {
        if (!this.token) return false;
        
        try {
            const response = await fetch(`${this.baseURL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }

    // Get authentication headers
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Update user info in UI
    updateUserInfo() {
        const userNameElement = document.querySelector('.user-info h4');
        const userRoleElement = document.querySelector('.user-info span');
        const userAvatarElement = document.querySelector('.user-profile .avatar');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.full_name || this.currentUser.username;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = this.getRoleDisplayName(this.currentUser.role);
        }
        
        if (userAvatarElement) {
            // Set avatar based on user role or use default
            const avatarUrl = this.getAvatarUrl(this.currentUser.role);
            userAvatarElement.src = avatarUrl;
        }
    }

    // Get role display name in Arabic
    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'مدير عام',
            'manager': 'مدير',
            'cashier': 'كاشير',
            'staff': 'موظف'
        };
        return roleNames[role] || role;
    }

    // Get avatar URL based on role
    getAvatarUrl(role) {
        const avatars = {
            'admin': 'https://i.pravatar.cc/150?img=11',
            'manager': 'https://i.pravatar.cc/150?img=12',
            'cashier': 'https://i.pravatar.cc/150?img=13',
            'staff': 'https://i.pravatar.cc/150?img=14'
        };
        return avatars[role] || 'https://i.pravatar.cc/150?img=15';
    }

    // Logout function
    logout(showMessage = true) {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Reset instance variables
        this.token = null;
        this.currentUser = {};
        
        // Show logout message
        if (showMessage && typeof showToast === 'function') {
            showToast('تم تسجيل الخروج بنجاح', 'success');
        }
        
        // Redirect to login page
        setTimeout(() => {
            this.redirectToLogin();
        }, showMessage ? 1000 : 0);
    }

    // Redirect to login page
    redirectToLogin() {
        window.location.href = 'login.html';
    }

    // Make authenticated API request
    async makeAuthenticatedRequest(endpoint, options = {}) {
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, config);
            
            // Check if token expired
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired');
            }
            
            return response;
        } catch (error) {
            console.error('Authenticated request failed:', error);
            throw error;
        }
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser.role === role;
    }

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        return roles.includes(this.currentUser.role);
    }

    // Check if user has admin privileges
    isAdmin() {
        return this.hasRole('admin');
    }

    // Check if user can perform action based on role
    canPerformAction(action) {
        const permissions = {
            'admin': ['*'], // Admin can do everything
            'manager': [
                'view_dashboard', 'manage_products', 'manage_categories', 
                'manage_customers', 'manage_suppliers', 'manage_sales', 
                'manage_purchases', 'manage_returns', 'view_inventory', 
                'view_reports', 'view_activity_logs'
            ],
            'cashier': [
                'view_dashboard', 'view_products', 'view_customers', 
                'manage_sales', 'manage_returns', 'view_inventory'
            ],
            'staff': [
                'view_dashboard', 'view_products', 'view_customers', 'view_inventory'
            ]
        };

        const userPermissions = permissions[this.currentUser.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(action);
    }

    // Show/hide UI elements based on permissions
    applyPermissions() {
        const permissionElements = document.querySelectorAll('[data-permission]');
        
        permissionElements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            const requiredRoles = element.getAttribute('data-roles');
            
            let hasPermission = false;
            
            if (requiredPermission) {
                hasPermission = this.canPerformAction(requiredPermission);
            } else if (requiredRoles) {
                const roles = requiredRoles.split(',').map(r => r.trim());
                hasPermission = this.hasAnyRole(roles);
            }
            
            if (!hasPermission) {
                element.style.display = 'none';
            }
        });
    }

    // Session timeout warning
    setupSessionTimeout() {
        // Only setup timeout if token exists and is valid
        if (!this.token || this.isTokenExpired()) return;
        
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            const timeUntilExpiry = expirationTime - currentTime;
            
            // If token expires in less than 5 minutes, don't setup timeout
            if (timeUntilExpiry < 5 * 60 * 1000) return;
            
            // Warn user 5 minutes before token expires
            const warningTime = timeUntilExpiry - (5 * 60 * 1000);
            
            setTimeout(() => {
                if (this.isAuthenticated() && confirm('ستنتهي جلستك قريباً. هل تريد تجديدها؟')) {
                    this.refreshToken();
                }
            }, warningTime);
        } catch (error) {
            console.error('Error setting up session timeout:', error);
        }
    }

    // Refresh authentication token
    async refreshToken() {
        try {
            const response = await this.makeAuthenticatedRequest('auth/refresh', {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.data.token);
                this.token = data.data.token;
                
                if (typeof showToast === 'function') {
                    showToast('تم تجديد الجلسة بنجاح', 'success');
                }
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
        }
    }
}

// Initialize session manager
let sessionManager;

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sessionManager = new SessionManager();
        window.sessionManager = sessionManager;
    });
} else {
    sessionManager = new SessionManager();
    window.sessionManager = sessionManager;
}

// Add logout functionality to the UI
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for sessionManager to be ready
    setTimeout(() => {
        if (!sessionManager || !sessionManager.isInitialized) return;
        
        // Add logout button to user profile
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.style.cursor = 'pointer';
            userProfile.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create dropdown menu
                const existingDropdown = document.querySelector('.user-dropdown');
                if (existingDropdown) {
                    existingDropdown.remove();
                    return;
                }
                
                const dropdown = document.createElement('div');
                dropdown.className = 'user-dropdown';
                dropdown.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: var(--bg-glass);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--border-glass);
                    border-radius: 12px;
                    box-shadow: var(--shadow-glass);
                    padding: 8px;
                    min-width: 200px;
                    z-index: 1000;
                    margin-top: 8px;
                `;
                
                dropdown.innerHTML = `
                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border-glass); margin-bottom: 8px;">
                        <strong>${sessionManager.getCurrentUser().full_name || sessionManager.getCurrentUser().username}</strong>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                            ${sessionManager.getRoleDisplayName(sessionManager.getCurrentUser().role)}
                        </div>
                    </div>
                    <button onclick="sessionManager.logout()" style="
                        width: 100%;
                        padding: 12px 16px;
                        background: rgba(239, 68, 68, 0.1);
                        border: none;
                        border-radius: 8px;
                        color: #ef4444;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-align: right;
                        font-family: var(--font-ar);
                    " onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">
                        <i class="fa-solid fa-sign-out-alt" style="margin-left: 8px;"></i>
                        تسجيل الخروج
                    </button>
                `;
                
                userProfile.style.position = 'relative';
                userProfile.appendChild(dropdown);
                
                // Close dropdown when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', function closeDropdown(e) {
                        if (!userProfile.contains(e.target)) {
                            dropdown.remove();
                            document.removeEventListener('click', closeDropdown);
                        }
                    });
                }, 100);
            });
        }
        
        // Apply permissions to UI elements
        if (sessionManager.applyPermissions) {
            sessionManager.applyPermissions();
        }
        
        // Setup session timeout warning
        if (sessionManager.setupSessionTimeout) {
            sessionManager.setupSessionTimeout();
        }
    }, 500);
});