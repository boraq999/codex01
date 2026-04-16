# Beauty Accessories Backend

Backend API لإدارة بيع الإكسسوارات ومواد التجميل باستخدام `Node.js`, `Express`, و`MySQL`.

## تشغيل المشروع

1. ثبّت قاعدة البيانات عبر تنفيذ [database/schema.sql](C:\Users\ofifi\OneDrive\Desktop\New%20folder%20(4)\MCP\codex\codex01\database\schema.sql)
2. أضف بيانات تجريبية عبر [database/seed.sql](C:\Users\ofifi\OneDrive\Desktop\New%20folder%20(4)\MCP\codex\codex01\database\seed.sql)
3. عدّل ملف `.env` إذا لزم
4. شغّل المشروع:

```bash
npm install
npm run dev
```

## بيانات الدخول الافتراضية

- `username`: `admin`
- `password`: `Admin@123`

## التوثيق

- Swagger: `http://localhost:4000/api/docs`
- Health Check: `http://localhost:4000/health`

## الوحدات المنفذة

- Authentication
- Categories
- Suppliers
- Employees
- Customers
- Products
- Purchases
- Sales
- Inventory Adjustments
- Activity Logs

## ملاحظات

- جميع المسارات تحت `/api/v1`
- جميع المسارات محمية بـ `JWT` ما عدا `/api/v1/auth/login`
- عمليات الشراء والبيع والتعديل اليدوي للمخزون تسجل حركات في `inventory_transactions` و`activity_logs`
