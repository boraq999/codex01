// API Testing Logic

const BASE_URL = 'http://localhost:4000/api/v1';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Dashboard Quick Connection Test
    const btnTestConnection = document.getElementById('btn-test-connection');
    const connectionResult = document.getElementById('connection-result');

    btnTestConnection.addEventListener('click', async () => {
        btnTestConnection.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الفحص...';
        
        try {
            // Let's test the root API endpoint or a health check (using categories as simple test)
            const res = await fetch(`${BASE_URL}/categories`);
            
            if(res.ok) {
                const data = await res.json();
                connectionResult.className = 'api-result-box mt-3 badge badge-success';
                connectionResult.textContent = 'الاتصال ناجح! الخادم يستجيب بشكل سليم.';
                showToast('تم الاتصال بالخادم بنجاح', 'success');
            } else {
                throw new Error(`Server returned status: ${res.status}`);
            }
        } catch (err) {
            connectionResult.className = 'api-result-box mt-3 badge badge-error';
            connectionResult.textContent = 'فشل الاتصال: يرجى التأكد من تشغيل الخادم (npm start)';
            showToast('الخادم لا يستجيب', 'error');
        } finally {
            connectionResult.classList.remove('hidden');
            btnTestConnection.innerHTML = '<i class="fa-solid fa-rotate"></i> فحص الاتصال بالـ API';
        }
    });

    // 2. API Tester interface logic
    const btnMakeRequest = document.getElementById('btn-make-request');
    const inputEndpoint = document.getElementById('api-endpoint');
    const selectMethod = document.getElementById('api-method');
    const textareaPayload = document.getElementById('api-payload');
    
    // UI Elements
    const responseStatus = document.getElementById('response-status');
    const responseContent = document.getElementById('api-response-content');

    // Payload Templates
    const payloadTemplates = {
        'auth/login': '{\n  "username": "admin",\n  "password": "Admin@123"\n}',
        'auth/register': '{\n  "username": "admin2",\n  "password": "Admin@123",\n  "role": "admin",\n  "employee_id": 1\n}',
        'products': '{\n  "name": "كريم مرطب",\n  "code": "PRD-001",\n  "barcode": "123456789",\n  "description": "كريم مرطب للوجه",\n  "category_id": 1,\n  "purchase_price": 30.00,\n  "selling_price": 45.00,\n  "current_stock": 50,\n  "min_stock": 10\n}',
        'categories': '{\n  "name": "عناية بالبشرة",\n  "description": "منتجات العناية بالبشرة"\n}',
        'suppliers': '{\n  "name": "مورد التجميل",\n  "phone": "0912345678",\n  "email": "supplier@test.com",\n  "address": "طرابلس"\n}',
        'employees': '{\n  "name": "موظف مبيعات",\n  "phone": "0921234567",\n  "position": "بائع",\n  "salary": 1500\n}',
        'customers': '{\n  "name": "زبون مميز",\n  "phone": "0911112222",\n  "email": "customer@test.com"\n}',
        'purchases': '{\n  "supplier_id": 1,\n  "employee_id": 1,\n  "total_amount": 1000,\n  "items": [\n    {\n      "product_id": 1,\n      "quantity": 10,\n      "unit_cost": 100\n    }\n  ]\n}',
        'sales': '{\n  "customer_id": 1,\n  "employee_id": 1,\n  "total_amount": 500,\n  "items": [\n    {\n      "product_id": 1,\n      "quantity": 5,\n      "unit_price": 100\n    }\n  ]\n}',
        'returns': '{\n  "sale_id": 1,\n  "employee_id": 1,\n  "total_refund": 100,\n  "items": [\n    {\n      "product_id": 1,\n      "quantity": 1,\n      "unit_price": 100,\n      "reason": "تالف"\n    }\n  ]\n}',
        'inventory': '{\n  "product_id": 1,\n  "quantity_change": 10,\n  "transaction_type": "adjustment_add",\n  "notes": "تعديل رصيد"\n}'
    };

    // Auto-update Payload when Endpoint changes
    inputEndpoint.addEventListener('change', (e) => {
        const endpoint = e.target.value;
        if(payloadTemplates[endpoint]) {
            textareaPayload.value = payloadTemplates[endpoint];
            selectMethod.value = 'POST'; // Automatically switch to POST for convenience
        } else {
            textareaPayload.value = '';
        }
    });

    // Trigger on load to set default
    inputEndpoint.dispatchEvent(new Event('change'));

    btnMakeRequest.addEventListener('click', async () => {
        const endpoint = inputEndpoint.value.trim();
        const method = selectMethod.value;
        const payloadRaw = textareaPayload.value.trim();

        if(!endpoint) {
            showToast('الرجاء إدخال مسار API', 'error');
            return;
        }

        const fullUrl = `${BASE_URL}/${endpoint}`;
        
        // Prepare options
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
                // Note: Auth Token can be added here once we implement Login
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        // Parse Payload for POST/PUT/PATCH
        if(method !== 'GET' && method !== 'DELETE') {
            if(payloadRaw) {
                try {
                    // Try to parse JSON to ensure it's valid, then stringify
                    const parsedPayload = JSON.parse(payloadRaw);
                    fetchOptions.body = JSON.stringify(parsedPayload);
                } catch(e) {
                    showToast('خطأ: البيانات المدخلة (JSON) غير صالحة تنسيقياً!', 'error');
                    responseStatus.className = 'badge badge-error';
                    responseStatus.textContent = 'JSON Parse Error';
                    responseContent.textContent = e.message;
                    return;
                }
            }
        }

        // Send request
        responseStatus.className = 'badge badge-default';
        responseStatus.textContent = 'جاري الإرسال...';
        responseContent.textContent = '...';
        
        btnMakeRequest.disabled = true;
        btnMakeRequest.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري...';

        try {
            const startTime = performance.now();
            const res = await fetch(fullUrl, fetchOptions);
            const duration = Math.round(performance.now() - startTime);

            const isSuccess = res.ok;
            
            // Try to parse JSON response, fallback to text
            let dataToShow;
            try {
                dataToShow = await res.json();
            } catch(e) {
                dataToShow = await res.text();
            }

            // Update UI
            if(isSuccess) {
                responseStatus.className = 'badge badge-success';
                showToast(`نجح الطلب (${res.status})`, 'success');
            } else {
                responseStatus.className = 'badge badge-error';
                showToast(`خطأ من الخادم (${res.status})`, 'error');
            }
            
            responseStatus.innerHTML = `Status: ${res.status} <span style="font-weight:normal; font-size:10px; margin-right:8px;">(${duration}ms)</span>`;
            responseContent.textContent = typeof dataToShow === 'object' ? JSON.stringify(dataToShow, null, 2) : dataToShow;

        } catch (err) {
            responseStatus.className = 'badge badge-error';
            responseStatus.textContent = 'Network Error / CORS';
            responseContent.textContent = err.message + '\n\nملاحظة: تأكد من تشغيل الخادم وتفعيل CORS.';
            showToast('حدث خطأ في الاتصال!', 'error');
        } finally {
            btnMakeRequest.disabled = false;
            btnMakeRequest.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الطلب';
        }
    });
});
