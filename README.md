# Beauty Accessories Backend & Frontend

نظام إدارة شامل لبيع الإكسسوارات ومواد التجميل مع واجهة أمامية متكاملة.

## 🚀 المميزات

### Backend (Node.js + Express + MySQL)
- **نظام مصادقة متكامل** مع JWT وإدارة الأدوار
- **12 وحدة كاملة**: المصادقة، الفئات، الموردين، الموظفين، العملاء، المنتجات، المشتريات، المبيعات، المرتجعات، المخزون، التقارير، سجل الأنشطة
- **إدارة المخزون التلقائية** مع تتبع الحركات
- **نظام تقارير شامل** للمبيعات والمشتريات والمخزون
- **توثيق Swagger** تفاعلي للـ APIs
- **نظام صلاحيات متدرج** (Admin, Manager, Cashier, Staff)

### Frontend (HTML + CSS + JavaScript)
- **واجهة عصرية** بتصميم Glass Morphism
- **دعم كامل للغة العربية** مع RTL
- **تكامل كامل مع Backend APIs**
- **مختبر API تفاعلي** لاختبار الـ endpoints
- **نظام إشعارات متقدم**
- **تصميم متجاوب** يعمل على جميع الأجهزة
- **وضع ليلي/نهاري**

## 📋 متطلبات النظام

- Node.js (v14 أو أحدث)
- MySQL (v8.0 أو أحدث)
- متصفح حديث يدعم ES6+

## ⚡ التشغيل السريع

### الطريقة الأولى: استخدام ملف التشغيل التلقائي
```bash
# على Windows
start.bat

# أو يدوياً
double-click start.bat
```

### الطريقة الثانية: التشغيل اليدوي

1. **إعداد قاعدة البيانات**
```sql
-- إنشاء قاعدة البيانات
CREATE DATABASE beauty_accessories;

-- تشغيل ملف الهيكل
source database/schema.sql

-- إضافة البيانات التجريبية
source database/seed.sql
```

2. **إعداد المتغيرات البيئية**
```bash
cp .env.example .env
# عدّل ملف .env حسب إعدادات قاعدة البيانات
```

3. **تثبيت التبعيات وتشغيل الخادم**
```bash
npm install
npm run dev
```

4. **فتح الواجهة الأمامية**
```bash
# افتح الملف في المتصفح
frontend/index.html
```

## 🔗 الروابط المهمة

- **الواجهة الأمامية**: `frontend/index.html`
- **Backend API**: `http://localhost:4000`
- **توثيق Swagger**: `http://localhost:4000/api/docs`
- **فحص الحالة**: `http://localhost:4000/health`

## 👤 بيانات الدخول الافتراضية

| المستخدم | كلمة المرور | الدور |
|----------|-------------|-------|
| admin | Admin@123 | مدير عام |
| manager | Admin@123 | مدير |
| cashier | Admin@123 | كاشير |

## 📚 دليل الاستخدام

### الواجهة الأمامية

1. **لوحة التحكم**: عرض إحصائيات سريعة وحالة النظام
2. **إدارة البيانات**: إضافة وتعديل وحذف (الفئات، المنتجات، العملاء، الموردين، الموظفين)
3. **العمليات**: إنشاء فواتير البيع والشراء والمرتجعات
4. **المخزون**: مراقبة حركة المخزون والتعديل اليدوي
5. **التقارير**: تقارير شاملة للمبيعات والمشتريات والمخزون
6. **سجل الأنشطة**: تتبع جميع العمليات في النظام
7. **مختبر API**: اختبار الـ endpoints مباشرة من الواجهة

### Backend APIs

جميع الـ APIs تحت المسار `/api/v1/`:

- `POST /auth/login` - تسجيل الدخول
- `GET|POST|PUT|DELETE /categories` - إدارة الفئات
- `GET|POST|PUT|DELETE /products` - إدارة المنتجات
- `GET|POST|PUT|DELETE /customers` - إدارة العملاء
- `GET|POST|PUT|DELETE /suppliers` - إدارة الموردين
- `GET|POST|PUT|DELETE /employees` - إدارة الموظفين
- `GET|POST /sales` - إدارة المبيعات
- `GET|POST /purchases` - إدارة المشتريات
- `GET|POST /returns` - إدارة المرتجعات
- `GET|POST /inventory` - إدارة المخزون
- `GET /reports/*` - التقارير
- `GET /activity-logs` - سجل الأنشطة

## 🔧 الميزات التقنية

### Backend
- **معمارية MVC** منظمة ومرنة
- **Middleware متقدم** للمصادقة والصلاحيات
- **معالجة أخطاء شاملة**
- **تسجيل العمليات** التلقائي
- **حماية CORS** وأمان متقدم
- **تحقق من صحة البيانات** باستخدام Joi

### Frontend
- **تصميم Glass Morphism** عصري
- **تكامل API كامل** مع معالجة الأخطاء
- **نظام إشعارات Toast**
- **مودالات ديناميكية** للإضافة والتعديل
- **جداول تفاعلية** مع البحث والفلترة
- **حالات التحميل** والرسائل التوضيحية

## 📁 هيكل المشروع

```
codex01/
├── src/                    # Backend source code
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── validators/        # Input validation
│   └── utils/             # Utility functions
├── frontend/              # Frontend application
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── index.html        # Main HTML file
├── database/             # Database files
│   ├── schema.sql        # Database structure
│   └── seed.sql          # Sample data
├── docs/                 # Documentation
└── start.bat            # Quick start script
```

## 🛠️ التطوير والتخصيص

### إضافة وحدة جديدة
1. إنشاء Model في `src/models/`
2. إنشاء Service في `src/services/`
3. إنشاء Controller في `src/controllers/`
4. إنشاء Routes في `src/routes/`
5. إضافة Validator في `src/validators/`
6. تحديث الواجهة الأمامية

### تخصيص التصميم
- تعديل متغيرات CSS في `frontend/css/style.css`
- إضافة أنماط جديدة في `frontend/css/additions.css`
- تخصيص الألوان والخطوط حسب الحاجة

## 🔒 الأمان

- **JWT Authentication** مع انتهاء صلاحية
- **تشفير كلمات المرور** باستخدام bcrypt
- **حماية CORS** مُكونة بعناية
- **تحقق من الصلاحيات** على مستوى الـ routes
- **تسجيل العمليات** لتتبع الأنشطة

## 📞 الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
1. راجع ملف `API_DOCUMENTATION.md` للتوثيق التفصيلي
2. استخدم مختبر API المدمج في الواجهة
3. تحقق من سجل الأخطاء في وحدة التحكم

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام والتطوير.

---

**تم تطوير هذا النظام ليكون حلاً شاملاً ومتكاملاً لإدارة متاجر الإكسسوارات ومواد التجميل** 💄✨
