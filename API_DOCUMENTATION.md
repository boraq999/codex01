# Beauty Accessories System - API Documentation

## معلومات عامة

- **Base URL**: `http://localhost:4000/api/v1`
- **Authentication**: JWT Token (Bearer Token)
- **Content-Type**: `application/json`

## التوثيق والدخول

### تسجيل الدخول
```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**بيانات الدخول الافتراضية:**
- Admin: `admin` / `Admin@123`
- Manager: `manager` / `Admin@123`
- Cashier: `cashier` / `Admin@123`

---

## إدارة الفئات (Categories)

### 1. قائمة الفئات
```
GET /categories
```
**الصلاحيات:** جميع المستخدمين

**Response:**
```json
{
  "success": true,
  "message": "Categories fetched successfully.",
  "data": [
    {
      "id": 1,
      "name": "مواد التجميل",
      "description": "منتجات العناية بالبشرة",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. تفاصيل فئة
```
GET /categories/:id
```
**الصلاحيات:** جميع المستخدمين

### 3. إضافة فئة جديدة
```
POST /categories
```
**الصلاحيات:** Admin, Manager

**Request Body:**
```json
{
  "name": "اسم الفئة",
  "description": "وصف الفئة",
  "status": "active"
}
```

### 4. تعديل فئة
```
PUT /categories/:id
```
**الصلاحيات:** Admin, Manager

### 5. حذف فئة
```
DELETE /categories/:id
```
**الصلاحيات:** Admin فقط

---

## إدارة الموردين (Suppliers)

### 1. قائمة الموردين
```
GET /suppliers
```
**الصلاحيات:** جميع المستخدمين

**Response:**
```json
{
  "success": true,
  "message": "Suppliers fetched successfully.",
  "data": [
    {
      "id": 1,
      "name": "شركة الجمال",
      "phone": "123456789",
      "email": "supplier@example.com",
      "address": "العنوان",
      "notes": "ملاحظات",
      "status": "active"
    }
  ]
}
```

### 2. تفاصيل مورد
```
GET /suppliers/:id
```

### 3. إضافة مورد جديد
```
POST /suppliers
```
**الصلاحيات:** Admin, Manager

**Request Body:**
```json
{
  "name": "اسم المورد",
  "phone": "رقم الهاتف",
  "email": "البريد الإلكتروني",
  "address": "العنوان",
  "notes": "ملاحظات",
  "status": "active"
}
```

### 4. تعديل مورد
```
PUT /suppliers/:id
```
**الصلاحيات:** Admin, Manager

### 5. حذف مورد
```
DELETE /suppliers/:id
```
**الصلاحيات:** Admin فقط

---

## إدارة الموظفين (Employees)

### 1. قائمة الموظفين
```
GET /employees
```
**الصلاحيات:** Admin, Manager

### 2. تفاصيل موظف
```
GET /employees/:id
```
**الصلاحيات:** Admin, Manager

### 3. إضافة موظف جديد
```
POST /employees
```
**الصلاحيات:** Admin فقط

**Request Body:**
```json
{
  "full_name": "اسم الموظف الكامل",
  "phone": "رقم الهاتف",
  "job_title": "المسمى الوظيفي",
  "salary": 5000.00,
  "hire_date": "2024-01-01",
  "status": "active"
}
```

### 4. تعديل موظف
```
PUT /employees/:id
```
**الصلاحيات:** Admin فقط

### 5. حذف موظف
```
DELETE /employees/:id
```
**الصلاحيات:** Admin فقط

---

## إدارة العملاء (Customers)

### 1. قائمة العملاء
```
GET /customers
```
**الصلاحيات:** جميع المستخدمين

### 2. تفاصيل عميل
```
GET /customers/:id
```

### 3. إضافة عميل جديد
```
POST /customers
```
**الصلاحيات:** Admin, Manager, Cashier

**Request Body:**
```json
{
  "full_name": "اسم العميل الكامل",
  "phone": "رقم الهاتف",
  "email": "البريد الإلكتروني",
  "address": "العنوان",
  "notes": "ملاحظات",
  "status": "active"
}
```

### 4. تعديل عميل
```
PUT /customers/:id
```
**الصلاحيات:** Admin, Manager, Cashier

### 5. حذف عميل
```
DELETE /customers/:id
```
**الصلاحيات:** Admin, Manager

---

## إدارة المنتجات (Products)

### 1. قائمة المنتجات (مع تفاصيل الفئة)
```
GET /products
```
**الصلاحيات:** جميع المستخدمين

**Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully.",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "name": "كريم الوجه",
      "sku": "FACE-001",
      "barcode": "1234567890",
      "description": "كريم مرطب للوجه",
      "cost_price": 50.00,
      "sale_price": 75.00,
      "stock_quantity": 100,
      "min_stock_level": 10,
      "status": "active",
      "category": {
        "id": 1,
        "name": "مواد التجميل"
      }
    }
  ]
}
```

### 2. تفاصيل منتج
```
GET /products/:id
```

### 3. إضافة منتج جديد
```
POST /products
```
**الصلاحيات:** Admin, Manager

**Request Body:**
```json
{
  "category_id": 1,
  "name": "اسم المنتج",
  "sku": "كود المنتج",
  "barcode": "الباركود",
  "description": "وصف المنتج",
  "cost_price": 50.00,
  "sale_price": 75.00,
  "stock_quantity": 100,
  "min_stock_level": 10,
  "status": "active"
}
```

### 4. تعديل منتج
```
PUT /products/:id
```
**الصلاحيات:** Admin, Manager

### 5. حذف منتج
```
DELETE /products/:id
```
**الصلاحيات:** Admin فقط

---

## إدارة المشتريات (Purchases)

### 1. قائمة المشتريات
```
GET /purchases
```
**الصلاحيات:** Admin, Manager

### 2. تفاصيل مشترى
```
GET /purchases/:id
```
**الصلاحيات:** Admin, Manager

### 3. إضافة مشترى جديد
```
POST /purchases
```
**الصلاحيات:** Admin, Manager

**Request Body:**
```json
{
  "supplier_id": 1,
  "purchase_date": "2024-01-01T10:00:00.000Z",
  "subtotal": 1000.00,
  "discount": 50.00,
  "tax": 95.00,
  "total_amount": 1045.00,
  "status": "completed",
  "notes": "ملاحظات",
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_cost": 50.00,
      "line_total": 500.00
    },
    {
      "product_id": 2,
      "quantity": 20,
      "unit_cost": 25.00,
      "line_total": 500.00
    }
  ]
}
```

### 4. إلغاء مشترى
```
PATCH /purchases/:id/cancel
```
**الصلاحيات:** Admin, Manager

---

## إدارة المبيعات (Sales)

### 1. قائمة المبيعات
```
GET /sales
```
**الصلاحيات:** Admin, Manager, Cashier

### 2. تفاصيل بيع
```
GET /sales/:id
```
**الصلاحيات:** Admin, Manager, Cashier

### 3. إضافة بيع جديد
```
POST /sales
```
**الصلاحيات:** Admin, Manager, Cashier

**Request Body:**
```json
{
  "customer_id": 1,
  "sale_date": "2024-01-01T10:00:00.000Z",
  "subtotal": 150.00,
  "discount": 10.00,
  "tax": 14.00,
  "total_amount": 154.00,
  "payment_status": "paid",
  "status": "completed",
  "notes": "ملاحظات",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 75.00,
      "line_total": 150.00
    }
  ]
}
```

### 4. إلغاء بيع
```
PATCH /sales/:id/cancel
```
**الصلاحيات:** Admin, Manager

---

## إدارة المرتجعات (Sale Returns)

### 1. قائمة المرتجعات
```
GET /returns
```
**الصلاحيات:** Admin, Manager, Cashier

### 2. تفاصيل مرتجع
```
GET /returns/:id
```
**الصلاحيات:** Admin, Manager, Cashier

### 3. إضافة مرتجع جديد
```
POST /returns
```
**الصلاحيات:** Admin, Manager, Cashier

**Request Body:**
```json
{
  "sale_id": 1,
  "return_date": "2024-01-01T10:00:00.000Z",
  "reason": "سبب الإرجاع",
  "total_amount": 75.00,
  "notes": "ملاحظات",
  "items": [
    {
      "sale_item_id": 1,
      "quantity": 1,
      "unit_price": 75.00,
      "line_total": 75.00
    }
  ]
}
```

---

## إدارة المخزون (Inventory)

### 1. قائمة حركات المخزون
```
GET /inventory
```
**الصلاحيات:** Admin, Manager

**Response:**
```json
{
  "success": true,
  "message": "Inventory transactions fetched successfully.",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "reference_type": "purchase",
      "reference_id": 1,
      "transaction_type": "purchase_in",
      "quantity": 10,
      "stock_before": 90,
      "stock_after": 100,
      "notes": "شراء جديد",
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 2. حركات منتج معين
```
GET /inventory/product/:productId
```
**الصلاحيات:** Admin, Manager

### 3. تعديل المخزون يدوياً
```
POST /inventory/adjust
```
**الصلاحيات:** Admin, Manager

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 5,
  "transaction_type": "adjustment_add",
  "notes": "تعديل يدوي للمخزون"
}
```

---

## التقارير (Reports)

### 1. تقرير لوحة التحكم
```
GET /reports/dashboard
```
**الصلاحيات:** Admin, Manager

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully.",
  "data": {
    "totalSales": 15000.00,
    "totalPurchases": 10000.00,
    "totalProducts": 150,
    "lowStockProducts": 5,
    "todaySales": 1200.00,
    "monthSales": 8500.00
  }
}
```

### 2. تقرير المبيعات
```
GET /reports/sales?startDate=2024-01-01&endDate=2024-01-31
```
**الصلاحيات:** Admin, Manager

### 3. تقرير المشتريات
```
GET /reports/purchases?startDate=2024-01-01&endDate=2024-01-31
```
**الصلاحيات:** Admin, Manager

---

## سجل الأنشطة (Activity Logs)

### 1. قائمة السجلات
```
GET /activity-logs
```
**الصلاحيات:** Admin, Manager

### 2. سجلات كيان معين
```
GET /activity-logs/:entityType/:entityId
```
**الصلاحيات:** Admin, Manager

**مثال:**
```
GET /activity-logs/product/1
```

---

## أكواد الحالة (Status Codes)

- `200` - نجح الطلب
- `201` - تم الإنشاء بنجاح
- `400` - خطأ في البيانات المرسلة
- `401` - غير مصرح بالدخول
- `403` - ممنوع الوصول
- `404` - غير موجود
- `500` - خطأ في الخادم

## أنواع الحالات (Status Types)

### حالات المنتجات:
- `active` - نشط
- `inactive` - غير نشط
- `archived` - مؤرشف

### حالات المبيعات والمشتريات:
- `draft` - مسودة
- `completed` - مكتمل
- `cancelled` - ملغي

### حالات الدفع:
- `pending` - في الانتظار
- `paid` - مدفوع
- `partial` - دفع جزئي

### أنواع حركات المخزون:
- `purchase_in` - دخول من مشترى
- `sale_out` - خروج من بيع
- `adjustment_add` - إضافة يدوية
- `adjustment_remove` - خصم يدوي
- `return_in` - دخول من مرتجع
- `return_out` - خروج من مرتجع

## ملاحظات مهمة

1. **التوثيق**: جميع الطلبات تحتاج JWT Token ما عدا `/auth/login`
2. **الصلاحيات**: Admin له صلاحيات كاملة على جميع العمليات
3. **التواريخ**: يجب إرسال التواريخ بصيغة ISO 8601
4. **الأرقام**: الأسعار والكميات يجب أن تكون أرقام موجبة
5. **المخزون**: يتم تحديث المخزون تلقائياً عند المشتريات والمبيعات والمرتجعات
6. **السجلات**: جميع العمليات تُسجل في `activity_logs`

## Swagger Documentation

للحصول على توثيق تفاعلي، قم بزيارة:
```
http://localhost:4000/api/docs
```

## Health Check

للتأكد من حالة الخادم:
```
GET http://localhost:4000/health
```