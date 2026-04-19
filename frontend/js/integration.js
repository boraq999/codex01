// API Integration and Data Management
class APIManager {
    constructor() {
        this.baseURL = 'http://localhost:4000/api/v1';
    }

    // Get headers with authentication from session manager
    getHeaders() {
        const sessionManager = window.sessionManager;
        if (sessionManager && sessionManager.isAuthenticated()) {
            return sessionManager.getAuthHeaders();
        }
        return {
            'Content-Type': 'application/json'
        };
    }

    // Generic API request method using session manager
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(url, config);
            
            // Check for authentication errors
            if (response.status === 401) {
                const sessionManager = window.sessionManager;
                if (sessionManager) {
                    sessionManager.logout();
                }
                throw new Error('Session expired');
            }
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Authentication methods (removed - handled by session manager)
    // Login and logout are now handled by SessionManager
    
    // Get current user from session manager
    getCurrentUser() {
        return this.sessionManager ? this.sessionManager.getCurrentUser() : {};
    }

    // Generic CRUD operations
    async getAll(entity) {
        return await this.request(entity);
    }

    async getById(entity, id) {
        return await this.request(`${entity}/${id}`);
    }

    async create(entity, data) {
        return await this.request(entity, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async update(entity, id, data) {
        return await this.request(`${entity}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(entity, id) {
        return await this.request(`${entity}/${id}`, {
            method: 'DELETE'
        });
    }

    // Specific API methods
    async getDashboardData() {
        return await this.request('reports/dashboard');
    }

    async getSalesReport(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return await this.request(`reports/sales?${params.toString()}`);
    }

    async getPurchasesReport(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return await this.request(`reports/purchases?${params.toString()}`);
    }

    async getInventoryTransactions() {
        return await this.request('inventory');
    }

    async adjustInventory(data) {
        return await this.request('inventory/adjust', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getActivityLogs() {
        return await this.request('activity-logs');
    }

    async cancelSale(id) {
        return await this.request(`sales/${id}/cancel`, {
            method: 'PATCH'
        });
    }

    async cancelPurchase(id) {
        return await this.request(`purchases/${id}/cancel`, {
            method: 'PATCH'
        });
    }
}

// Data Manager for handling UI updates
class DataManager {
    constructor() {
        this.api = new APIManager();
        this.currentView = 'dashboard';
        this.currentData = {};
        this.isLoading = false;
    }

    // Show loading state
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
        }
        this.isLoading = true;
    }

    // Hide loading state
    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
        }
        this.isLoading = false;
    }

    // Load dashboard data
    async loadDashboard() {
        try {
            const data = await this.api.getDashboardData();
            this.updateDashboardUI(data.data);
        } catch (error) {
            showToast('فشل في تحميل بيانات لوحة التحكم', 'error');
            console.error('Dashboard load error:', error);
        }
    }

    // Update dashboard UI
    updateDashboardUI(data) {
        // Update stats cards
        const elements = {
            'total-sales': data.totalSales || 0,
            'total-invoices': data.totalInvoices || 0,
            'total-purchases': data.totalPurchases || 0,
            'total-products': data.totalProducts || 0,
            'low-stock-products': data.lowStockProducts || 0
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = typeof value === 'number' && id.includes('total-') ? 
                    `$${value.toFixed(2)}` : value;
            }
        });
    }

    // Load table data
    async loadTableData(entity) {
        const tableBody = document.getElementById(`${entity}-table-body`);
        if (!tableBody) return;

        this.showLoading(tableBody.parentElement);

        try {
            const response = await this.api.getAll(entity);
            const data = response.data || [];
            
            this.currentData[entity] = data;
            this.renderTable(entity, data);
            
        } catch (error) {
            showToast(`فشل في تحميل بيانات ${this.getEntityName(entity)}`, 'error');
            console.error(`Load ${entity} error:`, error);
            this.renderEmptyState(tableBody, 'حدث خطأ في تحميل البيانات');
        } finally {
            this.hideLoading(tableBody.parentElement);
        }
    }

    // Render table data
    renderTable(entity, data) {
        const tableBody = document.getElementById(`${entity}-table-body`);
        if (!tableBody) return;

        if (!data || data.length === 0) {
            this.renderEmptyState(tableBody, 'لا توجد بيانات للعرض');
            return;
        }

        tableBody.innerHTML = data.map(item => this.renderTableRow(entity, item)).join('');
    }

    // Render table row based on entity type
    renderTableRow(entity, item) {
        switch (entity) {
            case 'categories':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.description || '-'}</td>
                        <td><span class="status-badge status-${item.status}">${this.getStatusText(item.status)}</span></td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'products':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>
                            <div style="font-family: monospace; font-size: 12px; color: var(--text-secondary);">
                                ${item.sku || '-'}
                            </div>
                            <div style="font-size: 11px; color: var(--text-secondary);">
                                ${item.barcode || '-'}
                            </div>
                        </td>
                        <td>${item.name}</td>
                        <td>${item.category?.name || '-'}</td>
                        <td style="font-family: var(--font-en);">$${item.sale_price}</td>
                        <td>
                            <span style="color: ${item.stock_quantity <= item.min_stock_level ? 'var(--danger)' : 'var(--text-primary)'}">
                                ${item.stock_quantity}
                            </span>
                        </td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'customers':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.full_name}</td>
                        <td>${item.phone || '-'}</td>
                        <td>${item.email || '-'}</td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'suppliers':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.phone || '-'}</td>
                        <td>${item.email || '-'}</td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'employees':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.full_name}</td>
                        <td>${item.phone || '-'}</td>
                        <td>${item.job_title || '-'}</td>
                        <td style="font-family: var(--font-en);">$${item.salary || 0}</td>
                        <td>${item.hire_date ? new Date(item.hire_date).toLocaleDateString('ar-SA') : '-'}</td>
                        <td><span class="status-badge status-${item.status}">${this.getStatusText(item.status)}</span></td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'sales':
                return `
                    <tr>
                        <td style="font-family: monospace;">${item.sale_no}</td>
                        <td>${new Date(item.sale_date).toLocaleDateString('ar-SA')}</td>
                        <td>${item.customer?.full_name || 'زبون نقدي'}</td>
                        <td style="font-family: var(--font-en);">$${item.total_amount}</td>
                        <td><span class="status-badge status-${item.payment_status}">${this.getPaymentStatusText(item.payment_status)}</span></td>
                        <td>${this.renderActionButtons(entity, item.id, item.status)}</td>
                    </tr>
                `;
            
            case 'purchases':
                return `
                    <tr>
                        <td style="font-family: monospace;">${item.purchase_no}</td>
                        <td>${new Date(item.purchase_date).toLocaleDateString('ar-SA')}</td>
                        <td>${item.supplier?.name || '-'}</td>
                        <td style="font-family: var(--font-en);">$${item.total_amount}</td>
                        <td><span class="status-badge status-${item.status}">${this.getStatusText(item.status)}</span></td>
                        <td>${this.renderActionButtons(entity, item.id, item.status)}</td>
                    </tr>
                `;
            
            case 'returns':
                return `
                    <tr>
                        <td style="font-family: monospace;">${item.return_no}</td>
                        <td>${new Date(item.return_date).toLocaleDateString('ar-SA')}</td>
                        <td style="font-family: monospace;">${item.sale?.sale_no || '-'}</td>
                        <td style="font-family: var(--font-en);">$${item.total_amount}</td>
                        <td>${item.reason || '-'}</td>
                        <td>${this.renderActionButtons(entity, item.id)}</td>
                    </tr>
                `;
            
            case 'inventory':
                return `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.product?.name || '-'}</td>
                        <td>${this.getTransactionTypeText(item.transaction_type)}</td>
                        <td>${item.quantity > 0 ? '+' : ''}${item.quantity}</td>
                        <td>${item.stock_before}</td>
                        <td>${item.stock_after}</td>
                        <td>${new Date(item.created_at).toLocaleDateString('ar-SA')}</td>
                    </tr>
                `;
            
            case 'activity-logs':
                return `
                    <tr>
                        <td>${new Date(item.created_at).toLocaleString('ar-SA')}</td>
                        <td>${item.user?.username || 'النظام'}</td>
                        <td>${item.action}</td>
                        <td>${item.description}</td>
                        <td><span class="status-badge">${item.entity_type}</span></td>
                    </tr>
                `;
            
            default:
                return '<tr><td colspan="100%">نوع البيانات غير مدعوم</td></tr>';
        }
    }

    // Render action buttons
    renderActionButtons(entity, id, status = null) {
        let buttons = `
            <div class="action-btns">
                <button class="btn-icon view-btn" onclick="viewItem('${entity}', ${id})" title="عرض">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn-icon edit-btn" onclick="editItem('${entity}', ${id})" title="تعديل">
                    <i class="fa-solid fa-pen"></i>
                </button>
        `;

        // Add cancel button for sales/purchases if not cancelled
        if ((entity === 'sales' || entity === 'purchases') && status !== 'cancelled') {
            buttons += `
                <button class="btn-icon delete-btn" onclick="cancelItem('${entity}', ${id})" title="إلغاء">
                    <i class="fa-solid fa-ban"></i>
                </button>
            `;
        } else if (entity !== 'sales' && entity !== 'purchases' && entity !== 'inventory' && entity !== 'activity-logs') {
            buttons += `
                <button class="btn-icon delete-btn" onclick="deleteItem('${entity}', ${id})" title="حذف">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
        }

        buttons += '</div>';
        return buttons;
    }

    // Render empty state
    renderEmptyState(container, message) {
        container.innerHTML = `
            <tr>
                <td colspan="100%" class="empty-state">
                    <i class="fa-solid fa-inbox"></i>
                    <h3>${message}</h3>
                    <p>لا توجد عناصر للعرض حالياً</p>
                </td>
            </tr>
        `;
    }

    // Helper methods
    getEntityName(entity) {
        const names = {
            'categories': 'الفئات',
            'products': 'المنتجات',
            'customers': 'العملاء',
            'suppliers': 'الموردين',
            'employees': 'الموظفين',
            'sales': 'المبيعات',
            'purchases': 'المشتريات',
            'returns': 'المرتجعات',
            'inventory': 'المخزون',
            'activity-logs': 'سجل الأنشطة'
        };
        return names[entity] || entity;
    }

    getStatusText(status) {
        const statuses = {
            'active': 'نشط',
            'inactive': 'غير نشط',
            'completed': 'مكتمل',
            'pending': 'في الانتظار',
            'cancelled': 'ملغي',
            'draft': 'مسودة',
            'suspended': 'معلق',
            'archived': 'مؤرشف'
        };
        return statuses[status] || status;
    }

    getPaymentStatusText(status) {
        const statuses = {
            'paid': 'مدفوع',
            'pending': 'في الانتظار',
            'partial': 'دفع جزئي'
        };
        return statuses[status] || status;
    }

    getTransactionTypeText(type) {
        const types = {
            'purchase_in': 'دخول من مشترى',
            'sale_out': 'خروج من بيع',
            'adjustment_add': 'إضافة يدوية',
            'adjustment_remove': 'خصم يدوي',
            'return_in': 'دخول من مرتجع',
            'return_out': 'خروج من مرتجع'
        };
        return types[type] || type;
    }

    // Save data
    async saveData(entity, data, id = null) {
        try {
            let response;
            if (id) {
                response = await this.api.update(entity, id, data);
                showToast('تم تحديث البيانات بنجاح', 'success');
            } else {
                response = await this.api.create(entity, data);
                showToast('تم إضافة البيانات بنجاح', 'success');
            }
            
            // Reload table data
            await this.loadTableData(entity);
            return response;
            
        } catch (error) {
            showToast('فشل في حفظ البيانات', 'error');
            console.error('Save error:', error);
            throw error;
        }
    }

    // Get item by ID
    async getItemById(entity, id) {
        try {
            const response = await this.api.getById(entity, id);
            return response.data;
        } catch (error) {
            showToast(`فشل في تحميل بيانات ${this.getEntityName(entity)}`, 'error');
            console.error('Get item error:', error);
            throw error;
        }
    }

    // Delete data
    async deleteData(entity, id) {
        if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            return;
        }

        try {
            await this.api.delete(entity, id);
            showToast('تم حذف البيانات بنجاح', 'success');
            await this.loadTableData(entity);
        } catch (error) {
            showToast('فشل في حذف البيانات', 'error');
            console.error('Delete error:', error);
        }
    }

    // Cancel sale/purchase
    async cancelItem(entity, id) {
        if (!confirm(`هل أنت متأكد من إلغاء هذا ${this.getEntityName(entity)}؟`)) {
            return;
        }

        try {
            if (entity === 'sales') {
                await this.api.cancelSale(id);
            } else if (entity === 'purchases') {
                await this.api.cancelPurchase(id);
            }
            
            showToast('تم الإلغاء بنجاح', 'success');
            await this.loadTableData(entity);
        } catch (error) {
            showToast('فشل في الإلغاء', 'error');
            console.error('Cancel error:', error);
        }
    }
}

// Global instance
const dataManager = new DataManager();

// Global functions for UI interactions
window.viewItem = function(entity, id) {
    console.log(`View ${entity} item:`, id);
    // Show item details in a modal or navigate to detail view
    showToast(`عرض تفاصيل ${dataManager.getEntityName(entity)} #${id}`, 'info');
};

window.editItem = async function(entity, id) {
    try {
        // Get item data
        const item = await dataManager.getItemById(entity, id);
        
        // Open modal with pre-filled data
        openModal(`${entity.slice(0, -1)}Modal`, item);
        
    } catch (error) {
        console.error('Edit item error:', error);
        showToast('فشل في تحميل بيانات التعديل', 'error');
    }
};

window.deleteItem = function(entity, id) {
    dataManager.deleteData(entity, id);
};

window.cancelItem = function(entity, id) {
    dataManager.cancelItem(entity, id);
};

// Report generation functions
window.generateSalesReport = async function() {
    const startDate = document.getElementById('sales-start-date').value;
    const endDate = document.getElementById('sales-end-date').value;
    
    try {
        const response = await dataManager.api.getSalesReport(startDate, endDate);
        showToast('تم إنشاء تقرير المبيعات', 'success');
        console.log('Sales Report:', response.data);
    } catch (error) {
        showToast('فشل في إنشاء التقرير', 'error');
    }
};

window.generatePurchasesReport = async function() {
    const startDate = document.getElementById('purchases-start-date').value;
    const endDate = document.getElementById('purchases-end-date').value;
    
    try {
        const response = await dataManager.api.getPurchasesReport(startDate, endDate);
        showToast('تم إنشاء تقرير المشتريات', 'success');
        console.log('Purchases Report:', response.data);
    } catch (error) {
        showToast('فشل في إنشاء التقرير', 'error');
    }
};

window.generateInventoryReport = async function() {
    try {
        const response = await dataManager.api.getAll('products');
        showToast('تم إنشاء تقرير المخزون', 'success');
        console.log('Inventory Report:', response.data);
    } catch (error) {
        showToast('فشل في إنشاء التقرير', 'error');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load dashboard data on startup
    dataManager.loadDashboard();
    
    // Set default dates for reports
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const dateInputs = [
        'sales-start-date', 'sales-end-date',
        'purchases-start-date', 'purchases-end-date'
    ];
    
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = id.includes('start') ? firstDayOfMonth : today;
        }
    });
});