# 🎯 Complete User Guide - Jewelry Website

## Quick Start

### Step 1: Start the Server
```bash
cd c:\Users\lenovo\OneDrive\Documents\GitHub\jewelry-website
node server/app.js
```

Expected output:
```
Server is running on http://localhost:3000
Connected to the SQLite database: ./db/database.sqlite
```

### Step 2: Open in Browser
Go to: **http://localhost:3000**

You should see the home page with products.

---

## ✅ All Features - How to Use

### 1️⃣ HOME PAGE
**Location:** http://localhost:3000

**What you can do:**
- ✅ View featured products in grid
- ✅ Browse jewelry collection
- ✅ Click product card to see details
- ✅ Add items to cart using "Add to Cart" button
- ✅ See cart count in header (changes as you add items)

**Navigation:**
- Click **"Products"** link to browse all products
- Click **"Cart"** link to view shopping cart
- Click gold **"Admin"** button to access admin panel

---

### 2️⃣ PRODUCT MANAGEMENT (Admin)
**Location:** http://localhost:3000/admin/products.html

**How to Add a Product:**
1. Click **"+ Add Product"** button
2. Fill in the form:
   - **Name:** (required) e.g., "Gold Necklace"
   - **Category:** e.g., "Necklaces"
   - **Price:** (required) e.g., "149.99"
   - **Stock:** e.g., "50"
   - **Description:** e.g., "Beautiful 14k gold necklace"
   - **Image URL:** (optional) Leave blank or enter image path
3. Click **"Save Product"** button
4. ✅ Product added! It appears in the table and on home page

**How to Edit a Product:**
1. Find the product in the table
2. Click the **✏️ pencil icon**
3. Modal opens with product details
4. Change any fields
5. Click **"Save Product"**
6. ✅ Product updated!

**How to Delete a Product:**
1. Find the product in the table
2. Click the **🗑️ trash icon**
3. Confirm deletion
4. ✅ Product removed!

**How to Search Products:**
1. Use the **search box** at the top
2. Type product name
3. Table filters automatically

**How to Filter by Category:**
1. Use the **filter dropdown** next to search box
2. Select category
3. Table shows only products in that category

---

### 3️⃣ CUSTOMER MANAGEMENT (Admin)
**Location:** http://localhost:3000/admin/customers.html

**How to Add a Customer:**
1. Click **"+ Add Customer"** button
2. Fill in the form:
   - **Full Name:** (required) e.g., "Jane Smith"
   - **Email:** (required) e.g., "jane@example.com"
   - **Phone:** e.g., "555-1234"
   - **Status:** Choose "Active" or "Inactive"
3. Click **"Save Changes"** button
4. ✅ Customer added! Appears in the table

**How to Edit a Customer:**
1. Click the **👁️ eye icon** in the table to view customer
2. Modal opens with customer details
3. Change any fields (Name, Email, Phone, Status, Notes)
4. Click **"Save Changes"**
5. ✅ Customer updated!

**How to Delete a Customer:**
1. Click the **🗑️ trash icon**
2. Confirm deletion
3. ✅ Customer removed!

**How to Search Customers:**
1. Use the **search box** at top
2. Type customer name or email
3. Table filters automatically

**How to Filter Customers:**
1. Use the **filter dropdown**
2. Select "Active" or "Inactive"
3. Table shows only customers with that status

**How to Export Customer List:**
1. Click **"Export List"** button
2. CSV file downloads to your computer
3. ✅ Open in Excel or Google Sheets

---

### 4️⃣ NEWSLETTER MANAGEMENT (Admin)
**Location:** http://localhost:3000/admin/customers.html

**How to Send a Newsletter:**
1. Go to **Admin** → **Customers**
2. Click **"📧 Send Newsletter"** button
3. Modal opens with newsletter form:
   - **Subject:** e.g., "New Summer Collection"
   - **Content:** Write your newsletter message
   - **Test Send:** (optional) Check this to send only to you first
4. Click **"Send Newsletter"**
5. ✅ Newsletter sent to all subscribers!

**How to Subscribe to Newsletter:**
On the home page footer:
1. Enter your email address
2. Click "Subscribe"
3. ✅ Subscribed! You'll receive newsletters

**Newsletter Database:**
- Subscribers are stored in database
- Sample subscribers already added
- Emails collected from subscription form

---

### 5️⃣ SHOPPING CART
**Location:** http://localhost:3000/cart.html

**How to Add to Cart:**
1. Go to home page
2. Click product card
3. Click **"Add to Cart"** button
4. ✅ Item added! Cart count increases

**How to View Cart:**
1. Click **"Cart"** link in navigation
2. Or click cart icon in header
3. ✅ See all items in cart table

**How to Manage Cart:**
- **Update Quantity:** Change number in quantity column
- **Remove Item:** Click "Remove" button
- **View Total:** See Subtotal, Tax (8%), and Total at bottom

**How to Proceed to Checkout:**
- Click **"Proceed to Checkout"** button (coming soon)

---

### 6️⃣ ADMIN DASHBOARD
**Location:** http://localhost:3000/admin/index.html

**What you see:**
- Statistics cards (totals, metrics)
- Navigation sidebar with links to:
  - Dashboard
  - Products
  - Orders
  - Customers
  - Analytics
  - Settings

**How to Navigate:**
1. Click menu item in sidebar
2. ✅ Page loads with that feature

---

## 🔧 Admin Access

**How to Access Admin:**
1. From home page, click gold **"Admin"** button (top right)
2. Or go directly to: http://localhost:3000/admin/index.html
3. ✅ You're in the admin panel!

**Admin Pages Available:**
- 📊 Dashboard (http://localhost:3000/admin/index.html)
- 💎 Products (http://localhost:3000/admin/products.html)
- 📦 Orders (http://localhost:3000/admin/orders.html)
- 👥 Customers (http://localhost:3000/admin/customers.html)
- 📈 Analytics (http://localhost:3000/admin/analytics.html)
- ⚙️ Settings (http://localhost:3000/admin/settings.html)

---

## 📱 Features Summary

### For Customers
✅ Browse products  
✅ View product details  
✅ Add to shopping cart  
✅ View cart items  
✅ Calculate totals with tax  
✅ Subscribe to newsletter  

### For Admin
✅ Add new products  
✅ Edit products  
✅ Delete products  
✅ Search & filter products  
✅ Add customers  
✅ Edit customers  
✅ Delete customers  
✅ Export customer list  
✅ Send newsletters to subscribers  
✅ View customer statistics  

---

## 🎯 Common Tasks

### Task 1: Add a New Product
```
1. Go to http://localhost:3000/admin/products.html
2. Click "+ Add Product" button
3. Enter: Name, Category, Price, Description
4. Click "Save Product"
5. Product appears on home page!
```

### Task 2: Add a New Customer
```
1. Go to http://localhost:3000/admin/customers.html
2. Click "+ Add Customer" button
3. Enter: Name, Email, Phone, Status
4. Click "Save Changes"
5. Customer appears in list!
```

### Task 3: Send Newsletter
```
1. Go to http://localhost:3000/admin/customers.html
2. Click "📧 Send Newsletter" button
3. Enter Subject and Content
4. Click "Send Newsletter"
5. Sent to all subscribers!
```

### Task 4: Shop as Customer
```
1. Go to http://localhost:3000
2. Click on a product
3. Click "Add to Cart"
4. Click "Cart" link
5. View and manage items
```

---

## 📊 Database

### Products Table
Stores jewelry products:
- ID (auto-generated)
- Name
- Description
- Price
- Image URL
- Created date

### Customers Table
Stores customer information:
- ID (auto-generated)
- Name
- Email (unique)
- Phone
- Status (active/inactive)
- Notes
- Total orders
- Total spent

### Newsletter Subscribers Table
Stores newsletter subscriptions:
- ID (auto-generated)
- Email (unique)
- Name
- Subscription status
- Signup date

---

## 🐛 Troubleshooting

### Problem: Server won't start
**Solution:**
```bash
# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start fresh
node server/app.js
```

### Problem: Cannot connect to localhost:3000
**Solution:**
- Make sure server is running (see message above)
- Try: http://127.0.0.1:3000
- Clear browser cache
- Try different browser

### Problem: Cannot add product
**Solution:**
- Make sure name and price are filled
- Check browser console for errors (F12)
- Refresh page after adding
- Check that database.sqlite exists

### Problem: Cannot add customer
**Solution:**
- Make sure name and email are filled
- Email must be unique (not used before)
- Check browser console for errors
- Refresh page after adding

### Problem: Newsletter button not showing
**Solution:**
- Go to Customers page (not Dashboard)
- Newsletter button is on Customers page only
- Refresh page

### Problem: Items not staying in cart
**Solution:**
- Cart items are stored locally (refreshed every second)
- Do not clear browser storage
- Try different browser
- Check browser's localStorage settings

---

## 🔐 Security Notes

**Current:**
- Products can be added/edited without login
- Customers can be added without login
- Newsletter can be sent without login

**For Production (To Add):**
- Admin login/password
- Permission levels
- Rate limiting
- Input validation
- HTTPS encryption

---

## 📞 API Endpoints (For Developers)

### Products
```
GET    /api/products              Get all products
GET    /api/products/:id          Get single product
POST   /api/products              Create product
PUT    /api/products/:id          Update product
DELETE /api/products/:id          Delete product
```

### Customers
```
GET    /api/customers             Get all customers
GET    /api/customers/:id         Get single customer
POST   /api/customers             Create customer
PUT    /api/customers/:id         Update customer
DELETE /api/customers/:id         Delete customer
```

### Newsletter
```
GET    /api/newsletter/subscribers    Get subscribers
POST   /api/newsletter/subscribe      Subscribe
POST   /api/newsletter/send           Send newsletter
```

---

## ✨ Tips & Tricks

1. **Keyboard Shortcuts:**
   - `F12` - Open developer console to see errors
   - `Ctrl+Shift+Delete` - Clear browser cache

2. **Export Customer Data:**
   - Click "Export List" on Customers page
   - Opens CSV file in Excel/Sheets

3. **Test Newsletter:**
   - Check "Send test email first" before sending to all
   - Newsletter logs saved in database

4. **Products Filter:**
   - Use search box for quick find
   - Use category filter for browsing

5. **Mobile-Friendly:**
   - All pages work on mobile browsers
   - Responsive design adapts to screen size

---

## 📝 Data Entry Examples

### Sample Product
```
Name: Diamond Engagement Ring
Category: Rings
Price: 2499.99
Stock: 10
Description: Beautiful 14k white gold ring with 1.5 carat diamond
Image URL: assets/images/ring1.jpg
```

### Sample Customer
```
Name: Sarah Johnson
Email: sarah.johnson@example.com
Phone: (555) 123-4567
Status: Active
Notes: VIP customer, prefers email contact
```

### Sample Newsletter
```
Subject: Exclusive Holiday Collection - 20% Off!
Content: 
Dear Valued Customers,

We're thrilled to introduce our exclusive holiday collection!
All items are on sale for 20% off this week only.

Visit our website to shop now: http://localhost:3000

Best regards,
The Jewelry Team
```

---

## 🎉 You're All Set!

Your jewelry website is now fully functional. Follow this guide to:
- ✅ Add and manage products
- ✅ Add and manage customers
- ✅ Send newsletters
- ✅ Let customers shop and add to cart
- ✅ Export data when needed

**Happy selling! 💎**

