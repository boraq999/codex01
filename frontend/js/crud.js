// CRUD Logic for Tables and Modals

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch for active view
    fetchTableData('categories');
});

// Mock or Fetch Table Data (Can be integrated with API)
async function fetchTableData(entity) {
    // This is where you would normally do: fetch(`${BASE_URL}/${entity}`)
    // For the sake of the frontend UI completion, we leave the function ready
    // You can integrate this easily with the `api.js` BASE_URL
    console.log(`Fetching data for ${entity}...`);
}

// Global Modal State
window.openModal = function(type, editData = null) {
    const modal = document.getElementById('genericModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const saveBtn = document.getElementById('modalSaveBtn');
    
    // Store edit data for later use
    modal.editData = editData;
    modal.modalType = type;

    // Build form based on type
    if(type === 'categoryModal') {
        title.innerHTML = `<i class="fa-solid fa-tags"></i> ${editData ? 'تعديل الفئة' : 'إضافة فئة جديدة'}`;
        body.innerHTML = `
            <div class="form-group">
                <label>اسم الفئة</label>
                <input type="text" id="category-name" class="form-control" placeholder="مثال: مواد التجميل" value="${editData?.name || ''}">
            </div>
            <div class="form-group mt-3">
                <label>الوصف</label>
                <textarea id="category-description" class="form-control" rows="3" placeholder="وصف الفئة...">${editData?.description || ''}</textarea>
            </div>
            <div class="form-group mt-3">
                <label>الحالة</label>
                <select id="category-status" class="form-control">
                    <option value="active" ${editData?.status === 'active' ? 'selected' : ''}>نشط</option>
                    <option value="inactive" ${editData?.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                </select>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('categories');
    } 
    else if(type === 'productModal') {
        title.innerHTML = `<i class="fa-solid fa-box-open"></i> ${editData ? 'تعديل المنتج' : 'إضافة منتج جديد'}`;
        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>اسم المنتج</label>
                    <input type="text" id="product-name" class="form-control" placeholder="اسم المنتج" value="${editData?.name || ''}">
                </div>
                <div class="form-group">
                    <label>الفئة</label>
                    <select id="product-category" class="form-control">
                        <option value="1" ${editData?.category_id == 1 ? 'selected' : ''}>مواد التجميل</option>
                        <option value="2" ${editData?.category_id == 2 ? 'selected' : ''}>عطور</option>
                        <option value="3" ${editData?.category_id == 3 ? 'selected' : ''}>عناية بالبشرة</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>SKU</label>
                    <input type="text" id="product-sku" class="form-control" placeholder="SKU" value="${editData?.sku || ''}">
                </div>
                <div class="form-group">
                    <label>الباركود</label>
                    <input type="text" id="product-barcode" class="form-control" placeholder="123456789" value="${editData?.barcode || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>سعر التكلفة ($)</label>
                    <input type="number" id="product-cost" step="0.01" class="form-control" placeholder="0.00" value="${editData?.cost_price || ''}">
                </div>
                <div class="form-group">
                    <label>سعر البيع ($)</label>
                    <input type="number" id="product-price" step="0.01" class="form-control" placeholder="0.00" value="${editData?.sale_price || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>المخزون الحالي</label>
                    <input type="number" id="product-stock" class="form-control" placeholder="0" value="${editData?.stock_quantity || ''}">
                </div>
                <div class="form-group">
                    <label>الحد الأدنى للمخزون</label>
                    <input type="number" id="product-min-stock" class="form-control" placeholder="10" value="${editData?.min_stock_level || ''}">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>وصف المنتج</label>
                <textarea id="product-description" class="form-control" rows="2" placeholder="معلومات إضافية...">${editData?.description || ''}</textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('products');
    }
    else if (type === 'customerModal') {
        title.innerHTML = `<i class="fa-solid fa-user"></i> ${editData ? 'تعديل العميل' : 'إضافة عميل جديد'}`;
        body.innerHTML = `
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="customer-name" class="form-control" placeholder="اسم العميل" value="${editData?.full_name || ''}">
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="text" id="customer-phone" class="form-control" placeholder="رقم الهاتف" value="${editData?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" id="customer-email" class="form-control" placeholder="email@example.com" value="${editData?.email || ''}">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>العنوان / ملاحظات</label>
                <textarea id="customer-address" class="form-control" rows="2" placeholder="العنوان أو أية ملاحظات إضافية...">${editData?.address || ''}</textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('customers');
    }
    else if (type === 'supplierModal') {
        title.innerHTML = `<i class="fa-solid fa-truck"></i> ${editData ? 'تعديل المورد' : 'إضافة مورد جديد'}`;
        body.innerHTML = `
            <div class="form-group">
                <label>اسم المورد / الشركة</label>
                <input type="text" id="supplier-name" class="form-control" placeholder="اسم الشركة أو المورد" value="${editData?.name || ''}">
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="text" id="supplier-phone" class="form-control" placeholder="رقم الهاتف" value="${editData?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" id="supplier-email" class="form-control" placeholder="email@example.com" value="${editData?.email || ''}">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>العنوان</label>
                <input type="text" id="supplier-address" class="form-control" placeholder="عنوان الشركة" value="${editData?.address || ''}">
            </div>
            <div class="form-group mt-3">
                <label>ملاحظات</label>
                <textarea id="supplier-notes" class="form-control" rows="2" placeholder="معلومات الدفع والتوصيل...">${editData?.notes || ''}</textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('suppliers');
    }
    else if (type === 'saleModal') {
        title.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> فاتورة بيع جديدة';
        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>العميل</label>
                    <select class="form-control">
                        <option>زبون نقدي عام</option>
                        <option>أحمد محمد</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" class="form-control" value="2024-01-01">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>المنتجات (اختر المنتج والكمية)</label>
                <div style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 8px;">
                    <button class="btn btn-primary btn-sm mb-2" style="width:100%;"><i class="fa-solid fa-barcode"></i> مسح باركود أو إضافة منتج</button>
                    <div style="min-height: 100px; text-align: center; color: var(--text-secondary); padding-top: 20px;">
                        القائمة فارغة
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>الخصم</label>
                    <input type="number" class="form-control" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>حالة الدفع</label>
                    <select class="form-control">
                        <option value="paid">مدفوع بالكامل</option>
                        <option value="pending">آجل</option>
                    </select>
                </div>
            </div>
        `;
    }
    else if (type === 'employeeModal') {
        title.innerHTML = `<i class="fa-solid fa-user-tie"></i> ${editData ? 'تعديل الموظف' : 'إضافة موظف جديد'}`;
        body.innerHTML = `
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="employee-name" class="form-control" placeholder="اسم الموظف الكامل" value="${editData?.full_name || ''}">
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>رقم الهاتف</label>
                    <input type="text" id="employee-phone" class="form-control" placeholder="رقم الهاتف" value="${editData?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" id="employee-email" class="form-control" placeholder="email@example.com" value="${editData?.email || ''}">
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>المسمى الوظيفي</label>
                    <input type="text" id="employee-job" class="form-control" placeholder="مثال: كاشير" value="${editData?.job_title || ''}">
                </div>
                <div class="form-group">
                    <label>الراتب ($)</label>
                    <input type="number" id="employee-salary" step="0.01" class="form-control" placeholder="0.00" value="${editData?.salary || ''}">
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>تاريخ التوظيف</label>
                    <input type="date" id="employee-hire-date" class="form-control" value="${editData?.hire_date ? editData.hire_date.split('T')[0] : ''}">
                </div>
                <div class="form-group">
                    <label>الحالة</label>
                    <select id="employee-status" class="form-control">
                        <option value="active" ${editData?.status === 'active' ? 'selected' : ''}>نشط</option>
                        <option value="inactive" ${editData?.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                        <option value="suspended" ${editData?.status === 'suspended' ? 'selected' : ''}>معلق</option>
                    </select>
                </div>
            </div>
            <div class="form-group mt-3">
                <label>ملاحظات</label>
                <textarea id="employee-notes" class="form-control" rows="2" placeholder="معلومات إضافية...">${editData?.notes || ''}</textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('employees');
    }
    else if (type === 'purchaseModal') {
        title.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> فاتورة شراء جديدة';
        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>المورد</label>
                    <select class="form-control">
                        <option>اختر المورد...</option>
                        <option>شركة الجمال المتقدم</option>
                        <option>مؤسسة العطور الذهبية</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" class="form-control" value="2024-01-01">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>المنتجات المشتراة</label>
                <div style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 8px;">
                    <button class="btn btn-primary btn-sm mb-2" style="width:100%;"><i class="fa-solid fa-plus"></i> إضافة منتج للفاتورة</button>
                    <div style="min-height: 100px; text-align: center; color: var(--text-secondary); padding-top: 20px;">
                        لم يتم إضافة منتجات بعد
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>الخصم</label>
                    <input type="number" class="form-control" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>حالة الدفع</label>
                    <select class="form-control">
                        <option value="paid">مدفوع بالكامل</option>
                        <option value="pending">آجل</option>
                    </select>
                </div>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('purchases');
    }
    else if (type === 'returnModal') {
        title.innerHTML = '<i class="fa-solid fa-rotate-left"></i> إضافة مرتجع';
        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>رقم فاتورة البيع</label>
                    <input type="text" class="form-control" placeholder="SAL-001">
                </div>
                <div class="form-group">
                    <label>تاريخ المرتجع</label>
                    <input type="date" class="form-control">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>سبب المرتجع</label>
                <select class="form-control">
                    <option>منتج معيب</option>
                    <option>عدم رضا العميل</option>
                    <option>منتج خاطئ</option>
                    <option>انتهاء صلاحية</option>
                    <option>أخرى</option>
                </select>
            </div>
            <div class="form-group mt-3">
                <label>المنتجات المرتجعة</label>
                <div style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 8px;">
                    <button class="btn btn-primary btn-sm mb-2" style="width:100%;"><i class="fa-solid fa-search"></i> البحث في منتجات الفاتورة</button>
                    <div style="min-height: 80px; text-align: center; color: var(--text-secondary); padding-top: 20px;">
                        أدخل رقم الفاتورة أولاً
                    </div>
                </div>
            </div>
            <div class="form-group mt-3">
                <label>ملاحظات إضافية</label>
                <textarea class="form-control" rows="2" placeholder="تفاصيل إضافية عن المرتجع..."></textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('returns');
    }
    else if (type === 'inventoryModal') {
        title.innerHTML = '<i class="fa-solid fa-dials"></i> تعديل مخزون يدوي';
        body.innerHTML = `
            <div class="form-group">
                <label>المنتج</label>
                <select class="form-control">
                    <option>اختر المنتج...</option>
                    <option>كريم مرطب - مخزون حالي: 25</option>
                    <option>عطر زهور - مخزون حالي: 12</option>
                    <option>أحمر شفاه - مخزون حالي: 8</option>
                </select>
            </div>
            <div class="form-row mt-3">
                <div class="form-group">
                    <label>نوع التعديل</label>
                    <select class="form-control">
                        <option value="add">إضافة للمخزون</option>
                        <option value="remove">خصم من المخزون</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الكمية</label>
                    <input type="number" class="form-control" placeholder="0" min="1">
                </div>
            </div>
            <div class="form-group mt-3">
                <label>سبب التعديل</label>
                <select class="form-control">
                    <option>جرد دوري</option>
                    <option>منتج تالف</option>
                    <option>خطأ في الإدخال</option>
                    <option>عينات مجانية</option>
                    <option>أخرى</option>
                </select>
            </div>
            <div class="form-group mt-3">
                <label>ملاحظات</label>
                <textarea class="form-control" rows="2" placeholder="تفاصيل التعديل..."></textarea>
            </div>
        `;
        saveBtn.onclick = () => saveCurrentData('inventory');
    }

    modal.classList.add('active');
}

window.closeModal = function() {
    const modal = document.getElementById('genericModal');
    modal.classList.remove('active');
}

function saveCurrentData(entity) {
    const modal = document.getElementById('genericModal');
    const editData = modal.editData;
    const isEdit = !!editData;
    
    // Show loading
    const saveBtn = document.getElementById('modalSaveBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
    saveBtn.disabled = true;

    // Collect form data based on entity type
    let formData = {};
    
    try {
        switch(entity) {
            case 'categories':
                formData = {
                    name: document.getElementById('category-name').value,
                    description: document.getElementById('category-description').value,
                    status: document.getElementById('category-status').value
                };
                break;
            case 'products':
                formData = {
                    name: document.getElementById('product-name').value,
                    category_id: document.getElementById('product-category').value,
                    sku: document.getElementById('product-sku').value,
                    barcode: document.getElementById('product-barcode').value,
                    cost_price: parseFloat(document.getElementById('product-cost').value) || 0,
                    sale_price: parseFloat(document.getElementById('product-price').value) || 0,
                    stock_quantity: parseInt(document.getElementById('product-stock').value) || 0,
                    min_stock_level: parseInt(document.getElementById('product-min-stock').value) || 0,
                    description: document.getElementById('product-description').value
                };
                break;
            case 'customers':
                formData = {
                    full_name: document.getElementById('customer-name').value,
                    phone: document.getElementById('customer-phone').value,
                    email: document.getElementById('customer-email').value,
                    address: document.getElementById('customer-address').value
                };
                break;
            case 'suppliers':
                formData = {
                    name: document.getElementById('supplier-name').value,
                    phone: document.getElementById('supplier-phone').value,
                    email: document.getElementById('supplier-email').value,
                    address: document.getElementById('supplier-address').value,
                    notes: document.getElementById('supplier-notes').value
                };
                break;
            case 'employees':
                formData = {
                    full_name: document.getElementById('employee-name').value,
                    phone: document.getElementById('employee-phone').value,
                    email: document.getElementById('employee-email').value,
                    job_title: document.getElementById('employee-job').value,
                    salary: parseFloat(document.getElementById('employee-salary').value) || 0,
                    hire_date: document.getElementById('employee-hire-date').value,
                    status: document.getElementById('employee-status').value,
                    notes: document.getElementById('employee-notes').value
                };
                break;
        }
        
        // Use dataManager to save
        if (typeof dataManager !== 'undefined') {
            dataManager.saveData(entity, formData, isEdit ? editData.id : null)
                .then(() => {
                    closeModal();
                })
                .catch((error) => {
                    console.error('Save error:', error);
                })
                .finally(() => {
                    saveBtn.innerHTML = originalText;
                    saveBtn.disabled = false;
                });
        } else {
            // Fallback for testing
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                closeModal();
                
                if (typeof showToast === 'function') {
                    showToast(`تم ${isEdit ? 'تحديث' : 'حفظ'} البيانات بنجاح`, 'success');
                }
            }, 800);
        }
        
    } catch (error) {
        console.error('Form data collection error:', error);
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        if (typeof showToast === 'function') {
            showToast('خطأ في جمع بيانات النموذج', 'error');
        }
    }
}

// Helpers for testing UI
function generateTableActions() {
    return \    `
        <div class="action-btns">
            <button class="btn-icon edit-btn" title="تعديل"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon delete-btn" title="حذف"><i class="fa-solid fa-trash"></i></button>
        </div>
    \`;
}
