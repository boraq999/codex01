// Base App Logic (UI Toggles, Navigation)

document.addEventListener('DOMContentLoaded', () => {

    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme
    if(localStorage.getItem('theme') === 'light') {
        body.classList.remove('dark-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if(body.classList.contains('dark-theme')) {
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(n => n.classList.remove('active'));
            views.forEach(v => {
                v.style.display = 'none';
                v.classList.remove('active');
            });

            // Add active to clicked
            item.classList.add('active');
            const targetId = 'view-' + item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            
            if(targetView) {
                targetView.style.display = 'block';
                // Trigger reflow for animation
                void targetView.offsetWidth; 
                targetView.classList.add('active');
                
                // Load data for the current view
                const target = item.getAttribute('data-target');
                loadViewData(target);
            }
        });
    });

    // Global Toast Notification System
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Load view data function
    window.loadViewData = function(target) {
        if (typeof dataManager !== 'undefined') {
            switch(target) {
                case 'dashboard':
                    dataManager.loadDashboard();
                    break;
                case 'categories':
                    dataManager.loadTableData('categories');
                    break;
                case 'products':
                    dataManager.loadTableData('products');
                    break;
                case 'customers':
                    dataManager.loadTableData('customers');
                    break;
                case 'suppliers':
                    dataManager.loadTableData('suppliers');
                    break;
                case 'employees':
                    dataManager.loadTableData('employees');
                    break;
                case 'sales':
                    dataManager.loadTableData('sales');
                    break;
                case 'purchases':
                    dataManager.loadTableData('purchases');
                    break;
                case 'returns':
                    dataManager.loadTableData('returns');
                    break;
                case 'inventory':
                    dataManager.loadTableData('inventory');
                    break;
                case 'activity-logs':
                    dataManager.loadTableData('activity-logs');
                    break;
                case 'reports':
                    // Load reports data
                    if (dataManager.loadDashboard) {
                        dataManager.loadDashboard();
                    }
                    break;
            }
        }
    }

    // API Tester functionality
    const btnMakeRequest = document.getElementById('btn-make-request');
    const btnTestConnection = document.getElementById('btn-test-connection');
    
    if (btnMakeRequest) {
        btnMakeRequest.addEventListener('click', async () => {
            const endpoint = document.getElementById('api-endpoint').value;
            const method = document.getElementById('api-method').value;
            const payload = document.getElementById('api-payload').value;
            const responseContent = document.getElementById('api-response-content');
            const responseStatus = document.getElementById('response-status');
            
            // Show loading
            btnMakeRequest.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
            btnMakeRequest.disabled = true;
            responseStatus.textContent = 'جاري المعالجة...';
            responseStatus.className = 'badge badge-warning';
            
            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                
                if (method !== 'GET' && payload.trim()) {
                    options.body = payload;
                }
                
                const response = await fetch(`http://localhost:4000/api/v1/${endpoint}`, options);
                const data = await response.json();
                
                responseStatus.textContent = `${response.status} ${response.statusText}`;
                responseStatus.className = response.ok ? 'badge badge-success' : 'badge badge-error';
                responseContent.textContent = JSON.stringify(data, null, 2);
                
            } catch (error) {
                responseStatus.textContent = 'خطأ في الاتصال';
                responseStatus.className = 'badge badge-error';
                responseContent.textContent = `خطأ: ${error.message}`;
            } finally {
                btnMakeRequest.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الطلب';
                btnMakeRequest.disabled = false;
            }
        });
    }
    
    if (btnTestConnection) {
        btnTestConnection.addEventListener('click', async () => {
            const resultDiv = document.getElementById('connection-result');
            
            btnTestConnection.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الفحص...';
            btnTestConnection.disabled = true;
            
            try {
                const response = await fetch('http://localhost:4000/health');
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <div style="color: var(--success); padding: 8px;">
                            <i class="fa-solid fa-check-circle"></i> 
                            الاتصال ناجح - الخادم يعمل بشكل طبيعي
                        </div>
                    `;
                    resultDiv.classList.remove('hidden');
                } else {
                    throw new Error('Server responded with error');
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div style="color: var(--danger); padding: 8px;">
                        <i class="fa-solid fa-circle-exclamation"></i> 
                        فشل الاتصال - تأكد من تشغيل الخادم على المنفذ 4000
                    </div>
                `;
                resultDiv.classList.remove('hidden');
            } finally {
                btnTestConnection.innerHTML = '<i class="fa-solid fa-rotate"></i> فحص الاتصال بالـ API';
                btnTestConnection.disabled = false;
            }
        });
    }

    // Initialize dashboard on load
    setTimeout(() => {
        // Wait for session manager to be ready
        if (window.sessionManager && window.sessionManager.isAuthenticated()) {
            loadViewData('dashboard');
        } else {
            // Wait a bit more for session manager
            setTimeout(() => {
                if (window.sessionManager && window.sessionManager.isAuthenticated()) {
                    loadViewData('dashboard');
                }
            }, 1000);
        }
    }, 1000);
});
