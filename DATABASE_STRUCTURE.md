# هيكلية قاعدة البيانات

## نظرة عامة
هذه الوثيقة تشرح التصميم المقترح لقاعدة بيانات مشروع منظومة بيع الإكسسوارات ومواد التجميل، بحيث تكون القاعدة:

- واضحة
- مترابطة
- قابلة للتوسع
- مناسبة لتتبع دورة حياة العناصر
- داعمة لسجل الحركات العام

تم تصميم قاعدة البيانات لتخدم مشروع `Backend API` المبني باستخدام:

- `Node.js`
- `Express.js`
- `MySQL`

وتتكامل هذه الوثيقة مع الملف:

- [PROJECT_OVERVIEW.md](C:\Users\ofifi\OneDrive\Desktop\New%20folder%20(4)\MCP\codex\codex01\PROJECT_OVERVIEW.md)

---

## أهداف تصميم قاعدة البيانات
القاعدة يجب أن تحقق الأمور التالية:

- تخزين بيانات المنتجات والموردين والموظفين والعملاء بشكل منظم
- دعم عمليات البيع والشراء
- تحديث المخزون بشكل صحيح
- تسجيل أي حركة على العناصر المهمة
- الحفاظ على علاقات واضحة بين الجداول
- تسهيل بناء التقارير لاحقًا

---

## اسم قاعدة البيانات المقترح

```sql
beauty_accessories_system
```

---

## المكونات الرئيسية لقاعدة البيانات
يمكن تقسيم الجداول إلى مجموعات وظيفية:

### 1. الجداول المرجعية
- `categories`
- `suppliers`
- `employees`
- `customers`
- `users`

### 2. جداول المنتجات والمخزون
- `products`
- `inventory_transactions`

### 3. جداول العمليات التجارية
- `purchases`
- `purchase_items`
- `sales`
- `sale_items`

### 4. جداول التتبع والتدقيق
- `activity_logs`

---

## الجداول الأساسية

## 1. جدول التصنيفات `categories`
يستخدم لتصنيف المنتجات.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `name` | `VARCHAR(150)` | اسم التصنيف |
| `description` | `TEXT` | وصف اختياري |
| `status` | `ENUM('active','inactive')` | حالة التصنيف |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | name | status |
|---|---|---|
| 1 | Makeup | active |
| 2 | Accessories | active |
| 3 | Skincare | active |

---

## 2. جدول الموردين `suppliers`
يحفظ بيانات الموردين الذين يتم الشراء منهم.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `name` | `VARCHAR(200)` | اسم المورد |
| `phone` | `VARCHAR(30)` | الهاتف |
| `email` | `VARCHAR(150)` | البريد الإلكتروني |
| `address` | `TEXT` | العنوان |
| `notes` | `TEXT` | ملاحظات |
| `status` | `ENUM('active','inactive')` | الحالة |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | name | phone | status |
|---|---|---|---|
| 1 | Noor Cosmetics Supply | 0912345678 | active |
| 2 | Elegant Accessories Hub | 0921112233 | active |

---

## 3. جدول الموظفين `employees`
يحفظ بيانات الموظفين داخل النظام.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `full_name` | `VARCHAR(200)` | اسم الموظف |
| `phone` | `VARCHAR(30)` | الهاتف |
| `job_title` | `VARCHAR(150)` | الوظيفة |
| `salary` | `DECIMAL(12,2)` | الراتب |
| `hire_date` | `DATE` | تاريخ التعيين |
| `status` | `ENUM('active','inactive','suspended')` | الحالة |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | full_name | job_title | status |
|---|---|---|---|
| 1 | Amina Saleh | Sales Manager | active |
| 2 | Sara Khaled | Cashier | active |

---

## 4. جدول العملاء `customers`
يحفظ بيانات العملاء المرتبطين بالمبيعات.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `full_name` | `VARCHAR(200)` | اسم العميل |
| `phone` | `VARCHAR(30)` | الهاتف |
| `email` | `VARCHAR(150)` | البريد |
| `address` | `TEXT` | العنوان |
| `notes` | `TEXT` | ملاحظات |
| `status` | `ENUM('active','inactive')` | الحالة |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

---

## 5. جدول المستخدمين `users`
هذا الجدول خاص بحسابات الدخول إلى النظام.

عادة يتم ربط المستخدم بموظف.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `employee_id` | `BIGINT` | مرجع إلى الموظف |
| `username` | `VARCHAR(100)` | اسم المستخدم |
| `password_hash` | `VARCHAR(255)` | كلمة المرور المشفرة |
| `role` | `ENUM('admin','manager','cashier','staff')` | الدور |
| `status` | `ENUM('active','inactive')` | الحالة |
| `last_login_at` | `DATETIME` | آخر دخول |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

---

## 6. جدول المنتجات `products`
أهم جدول في النظام، ويخزن بيانات المنتجات.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `category_id` | `BIGINT` | مرجع للتصنيف |
| `name` | `VARCHAR(200)` | اسم المنتج |
| `sku` | `VARCHAR(100)` | كود داخلي |
| `barcode` | `VARCHAR(100)` | باركود اختياري |
| `description` | `TEXT` | وصف |
| `cost_price` | `DECIMAL(12,2)` | سعر الشراء |
| `sale_price` | `DECIMAL(12,2)` | سعر البيع |
| `stock_quantity` | `INT` | الكمية الحالية |
| `min_stock_level` | `INT` | الحد الأدنى |
| `status` | `ENUM('active','inactive','archived')` | الحالة |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | category_id | name | sku | cost_price | sale_price | stock_quantity |
|---|---|---|---|---|---|---|
| 1 | 1 | Matte Lipstick Ruby | COS-0001 | 18.00 | 30.00 | 120 |
| 2 | 2 | Gold Hair Clip | ACC-0001 | 4.50 | 10.00 | 75 |

---

## 7. جدول المشتريات `purchases`
يمثل رأس فاتورة الشراء.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `purchase_no` | `VARCHAR(100)` | رقم الفاتورة |
| `supplier_id` | `BIGINT` | المورد |
| `created_by` | `BIGINT` | المستخدم أو الموظف المنفذ |
| `purchase_date` | `DATETIME` | تاريخ الفاتورة |
| `subtotal` | `DECIMAL(12,2)` | الإجمالي قبل الخصم |
| `discount` | `DECIMAL(12,2)` | الخصم |
| `tax` | `DECIMAL(12,2)` | الضريبة |
| `total_amount` | `DECIMAL(12,2)` | الإجمالي النهائي |
| `status` | `ENUM('draft','completed','cancelled')` | الحالة |
| `notes` | `TEXT` | ملاحظات |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | purchase_no | supplier_id | total_amount | status |
|---|---|---|---|---|
| 1 | PUR-202604-001 | 1 | 850.00 | completed |

---

## 8. جدول تفاصيل المشتريات `purchase_items`
يحفظ المنتجات داخل فاتورة الشراء.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `purchase_id` | `BIGINT` | مرجع إلى فاتورة الشراء |
| `product_id` | `BIGINT` | المنتج |
| `quantity` | `INT` | الكمية |
| `unit_cost` | `DECIMAL(12,2)` | تكلفة الوحدة |
| `line_total` | `DECIMAL(12,2)` | إجمالي السطر |
| `created_at` | `DATETIME` | تاريخ الإنشاء |

### مثال

| id | purchase_id | product_id | quantity | unit_cost | line_total |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 20 | 18.00 | 360.00 |
| 2 | 1 | 2 | 50 | 4.50 | 225.00 |

---

## 9. جدول المبيعات `sales`
يمثل رأس فاتورة البيع.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `sale_no` | `VARCHAR(100)` | رقم الفاتورة |
| `customer_id` | `BIGINT` | العميل |
| `created_by` | `BIGINT` | المستخدم أو الموظف المنفذ |
| `sale_date` | `DATETIME` | تاريخ البيع |
| `subtotal` | `DECIMAL(12,2)` | الإجمالي قبل الخصم |
| `discount` | `DECIMAL(12,2)` | الخصم |
| `tax` | `DECIMAL(12,2)` | الضريبة |
| `total_amount` | `DECIMAL(12,2)` | الإجمالي النهائي |
| `payment_status` | `ENUM('pending','paid','partial')` | حالة السداد |
| `status` | `ENUM('draft','completed','cancelled')` | حالة الفاتورة |
| `notes` | `TEXT` | ملاحظات |
| `created_at` | `DATETIME` | تاريخ الإنشاء |
| `updated_at` | `DATETIME` | تاريخ التحديث |

### مثال

| id | sale_no | customer_id | total_amount | payment_status | status |
|---|---|---|---|---|---|
| 1 | SAL-202604-001 | 1 | 95.00 | paid | completed |

---

## 10. جدول تفاصيل المبيعات `sale_items`
يحفظ المنتجات داخل فاتورة البيع.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `sale_id` | `BIGINT` | مرجع إلى فاتورة البيع |
| `product_id` | `BIGINT` | المنتج |
| `quantity` | `INT` | الكمية |
| `unit_price` | `DECIMAL(12,2)` | سعر الوحدة |
| `line_total` | `DECIMAL(12,2)` | إجمالي السطر |
| `created_at` | `DATETIME` | تاريخ الإنشاء |

### مثال

| id | sale_id | product_id | quantity | unit_price | line_total |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 2 | 30.00 | 60.00 |
| 2 | 1 | 2 | 3 | 10.00 | 30.00 |

---

## 11. جدول حركات المخزون `inventory_transactions`
هذا الجدول مسؤول عن تسجيل جميع التغييرات التي تؤثر على كمية المنتج.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `product_id` | `BIGINT` | المنتج |
| `reference_type` | `ENUM('purchase','sale','adjustment','return','manual')` | نوع المرجع |
| `reference_id` | `BIGINT` | رقم المرجع |
| `transaction_type` | `ENUM('purchase_in','sale_out','adjustment_add','adjustment_remove','return_in','return_out')` | نوع الحركة |
| `quantity` | `INT` | كمية الحركة |
| `stock_before` | `INT` | الكمية قبل الحركة |
| `stock_after` | `INT` | الكمية بعد الحركة |
| `notes` | `TEXT` | ملاحظات |
| `created_by` | `BIGINT` | منفذ الحركة |
| `created_at` | `DATETIME` | تاريخ الإنشاء |

### مثال

| id | product_id | reference_type | reference_id | transaction_type | quantity | stock_before | stock_after |
|---|---|---|---|---|---|---|---|
| 1 | 1 | purchase | 1 | purchase_in | 20 | 100 | 120 |
| 2 | 1 | sale | 1 | sale_out | 2 | 120 | 118 |

---

## 12. جدول سجل الحركات `activity_logs`
هذا جدول عام لتوثيق أي تغيير أو عملية داخل النظام، وليس فقط المخزون.

### الحقول المقترحة

| الحقل | النوع | الوصف |
|---|---|---|
| `id` | `BIGINT` | المعرف الرئيسي |
| `entity_type` | `VARCHAR(100)` | نوع الكيان مثل product أو supplier |
| `entity_id` | `BIGINT` | رقم الكيان |
| `action` | `VARCHAR(100)` | نوع الإجراء |
| `description` | `TEXT` | وصف الحركة |
| `performed_by` | `BIGINT` | المنفذ |
| `metadata` | `JSON` | تفاصيل إضافية |
| `created_at` | `DATETIME` | تاريخ الإنشاء |

### مثال

| id | entity_type | entity_id | action | description |
|---|---|---|---|---|
| 1 | product | 1 | created | New product created |
| 2 | product | 1 | stock_added | Stock increased through purchase |
| 3 | sale | 1 | completed | Sale invoice completed |

---

## العلاقات بين الجداول

### العلاقات الرئيسية
- `products.category_id` يرتبط بـ `categories.id`
- `purchases.supplier_id` يرتبط بـ `suppliers.id`
- `purchase_items.purchase_id` يرتبط بـ `purchases.id`
- `purchase_items.product_id` يرتبط بـ `products.id`
- `sales.customer_id` يرتبط بـ `customers.id`
- `sale_items.sale_id` يرتبط بـ `sales.id`
- `sale_items.product_id` يرتبط بـ `products.id`
- `inventory_transactions.product_id` يرتبط بـ `products.id`
- `users.employee_id` يرتبط بـ `employees.id`

---

## مثال عملي مترابط
نفترض السيناريو التالي:

### المرحلة 1: إنشاء منتج
تم إنشاء المنتج:

- `name = Matte Lipstick Ruby`
- `sku = COS-0001`
- `stock_quantity = 100`

ينتج عن ذلك:
- إضافة سجل في `products`
- إضافة سجل في `activity_logs` يوضح إنشاء المنتج

### المرحلة 2: شراء كمية إضافية
تم شراء 20 قطعة من المورد رقم 1.

ينتج عن ذلك:
- إضافة سجل في `purchases`
- إضافة سطر أو أكثر في `purchase_items`
- تحديث `products.stock_quantity`
- إضافة سجل في `inventory_transactions`
- إضافة سجل في `activity_logs`

### المرحلة 3: بيع جزء من الكمية
تم بيع 2 قطعة.

ينتج عن ذلك:
- إضافة سجل في `sales`
- إضافة سجل في `sale_items`
- خصم الكمية من `products.stock_quantity`
- إضافة سجل في `inventory_transactions`
- إضافة سجل في `activity_logs`

---

## مثال تسلسلي مبسط للبيانات

### المنتج قبل الشراء

| product_id | name | stock_quantity |
|---|---|---|
| 1 | Matte Lipstick Ruby | 100 |

### بعد عملية شراء 20 قطعة

| product_id | name | stock_quantity |
|---|---|---|
| 1 | Matte Lipstick Ruby | 120 |

### بعد بيع 2 قطعة

| product_id | name | stock_quantity |
|---|---|---|
| 1 | Matte Lipstick Ruby | 118 |

### سجل المخزون لنفس المنتج

| id | transaction_type | quantity | stock_before | stock_after |
|---|---|---|---|---|
| 1 | purchase_in | 20 | 100 | 120 |
| 2 | sale_out | 2 | 120 | 118 |

---

## ملاحظات تصميم مهمة

### 1. عدم الاعتماد فقط على `stock_quantity`
الحقل `stock_quantity` مفيد للوصول السريع للكمية الحالية، لكنه ليس بديلًا عن سجل الحركات.

لذلك:
- `products.stock_quantity` يعطي الحالة الحالية
- `inventory_transactions` يعطي التاريخ الكامل

### 2. استخدام `activity_logs` للتتبع العام
ليس كل تغيير يخص المخزون فقط، لذلك نحتاج جدولًا عامًا للتتبع.

### 3. استخدام `status`
يفضل أن تحتوي الجداول الرئيسية على حقل `status` لتجنب الحذف المباشر، وللسماح بالإيقاف أو الأرشفة.

### 4. دعم `soft delete`
يمكن مستقبلًا إضافة:

- `deleted_at`
- `deleted_by`

وذلك في الجداول الحساسة بدل الحذف النهائي.

### 5. استخدام `transactions` في MySQL
في عمليات:

- البيع
- الشراء
- الإلغاء
- التسويات

يجب تنفيذ الخطوات داخل `database transaction` حتى لا يحدث خلل في المخزون أو البيانات.

---

## مثال مبسط للعلاقات بشكل نصي

```text
categories
   └── products
          ├── purchase_items ── purchases ── suppliers
          ├── sale_items ────── sales ────── customers
          └── inventory_transactions

employees
   └── users

all important entities
   └── activity_logs
```

---

## اقتراح أولي للمفاتيح والفهارس

### المفاتيح الرئيسية
- جميع الجداول تعتمد `id` كمفتاح رئيسي

### الفهارس المقترحة
- فهرس على `products.sku`
- فهرس على `products.barcode`
- فهرس على `purchases.purchase_no`
- فهرس على `sales.sale_no`
- فهرس على `inventory_transactions.product_id`
- فهرس على `activity_logs.entity_type, entity_id`
- فهرس على `users.username`

هذا مهم لتحسين البحث وسرعة الاستعلام.

---

## النتيجة المتوقعة من هذا التصميم
هذه الهيكلية تمنحنا قاعدة بيانات:

- بسيطة وواضحة
- مناسبة للمشروع من البداية
- قابلة للتوسع مستقبلًا
- تدعم منطق الأعمال بشكل صحيح
- تحقق تتبعًا كاملاً لجميع الحركات

---

## الخطوة التالية
بعد اعتماد هذه الوثيقة، تكون الخطوة التالية:

1. تحويل هذا التصميم إلى `schema.sql`
2. إنشاء العلاقات الفعلية `FOREIGN KEYS`
3. تجهيز `seed.sql` ببيانات تجريبية
4. البدء في بناء `models` و`services` اعتمادًا على هذا التصميم

