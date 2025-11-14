# 🎬 STEP-BY-STEP TUTORIAL - How to Use Everything

## 📺 Video-Style Instructions

---

## 🎯 SECTION 1: Getting Started

### Step 1: Open Terminal
1. Press `Windows Key + R`
2. Type: `powershell`
3. Press Enter

### Step 2: Navigate to Project
```powershell
cd "c:\Users\lenovo\OneDrive\Documents\GitHub\jewelry-website"
```

### Step 3: Start the Server
```powershell
node server/app.js
```

**You should see:**
```
Server is running on http://localhost:3000
Connected to the SQLite database: ./db/database.sqlite
```

✅ **Server is now running!** Leave this terminal open.

---

## 🎬 SECTION 2: Open the Website

### Step 1: Open Web Browser
- Open **Chrome**, **Firefox**, or **Edge**

### Step 2: Go to Home Page
- Type in address bar: `http://localhost:3000`
- Press Enter
- ✅ You should see the **Jewelry Store Home Page**

### What you see on home page:
- Header with logo and navigation
- "Admin" button (gold, top right)
- "Cart" link in navigation
- Hero section with featured products
- Grid of products below

---

## 🎬 SECTION 3: Adding a Product

### Step 1: Go to Admin
- Click the gold **"Admin"** button (top right)
- ✅ Admin dashboard appears

### Step 2: Go to Products Page
- Click **"💎 Products"** in the sidebar
- ✅ Product list page appears

### Step 3: Add New Product
- Click **"+ Add Product"** button (top right)
- ✅ Modal window appears with form

### Step 4: Fill in Product Form
Fill each field:

1. **Name:** Type "Emerald Necklace"
2. **Category:** Type "Necklaces"
3. **Price:** Type "149.99"
4. **Stock:** Type "25"
5. **Description:** Type "Beautiful emerald on gold chain"
6. **Image URL:** Leave blank or type "assets/images/necklace1.jpg"

### Step 5: Save Product
- Click **"Save Product"** button
- ✅ Success! Product added to table

### Step 6: Verify on Home Page
- Go back to: `http://localhost:3000`
- ✅ Your new product appears in the grid!

---

## 🎬 SECTION 4: Editing a Product

### Step 1: Go to Admin Products
- Click Admin button → Products

### Step 2: Find Product to Edit
- Look for your product in the table
- Click the **✏️ pencil icon** in the Actions column

### Step 3: Edit Details
- Modal opens with current product info
- Change any field (e.g., price to 159.99)

### Step 4: Save Changes
- Click **"Save Product"** button
- ✅ Product updated!

---

## 🎬 SECTION 5: Deleting a Product

### Step 1: Go to Products Admin
- Admin → Products

### Step 2: Find Product to Delete
- Look for product in table
- Click the **🗑️ trash icon** in Actions

### Step 3: Confirm Deletion
- Click "OK" in confirmation dialog
- ✅ Product deleted!

---

## 🎬 SECTION 6: Adding a Customer

### Step 1: Go to Admin Customers
- Click Admin button
- Click **"👥 Customers"** in sidebar
- ✅ Customers page appears

### Step 2: Add New Customer
- Click **"+ Add Customer"** button
- ✅ Modal with customer form appears

### Step 3: Fill Customer Form
1. **Full Name:** "Emma Watson"
2. **Email:** "emma@example.com"
3. **Phone:** "(555) 987-6543"
4. **Status:** Select "Active"
5. **Notes:** "Prefers phone contact"

### Step 4: Save Customer
- Click **"Save Changes"** button
- ✅ Customer added to table!

---

## 🎬 SECTION 7: Editing a Customer

### Step 1: Go to Customers Admin
- Admin → Customers

### Step 2: Open Customer Details
- Click the **👁️ eye icon** next to customer name
- ✅ Customer details modal appears

### Step 3: Edit Information
- Change any field (e.g., phone number)

### Step 4: Save
- Click **"Save Changes"** button
- ✅ Customer updated!

---

## 🎬 SECTION 8: Deleting a Customer

### Step 1: Go to Customers Admin
- Admin → Customers

### Step 2: Delete Customer
- Click the **🗑️ trash icon** next to customer
- Confirm deletion
- ✅ Customer removed!

---

## 🎬 SECTION 9: Sending Newsletter

### Step 1: Go to Customers Page
- Admin → Customers

### Step 2: Click Send Newsletter
- Click the gold **"📧 Send Newsletter"** button
- ✅ Newsletter composer modal appears

### Step 3: Write Newsletter
1. **Subject:** "New Spring Collection Is Here!"
2. **Content:** 
```
Dear Valued Customers,

We're excited to announce our new spring collection 
featuring beautiful emerald and sapphire pieces!

Visit us today to see all the new designs.

Best regards,
The Jewelry Team
```

### Step 4: Send Newsletter
- Click **"Send Newsletter"** button
- ✅ Newsletter sent to all subscribers!

---

## 🎬 SECTION 10: Shopping as a Customer

### Step 1: Go to Home Page
- Go to: `http://localhost:3000`

### Step 2: Browse Products
- See all products in grid
- Click on any product card to see details

### Step 3: Add to Cart
- Click **"Add to Cart"** button on product
- ✅ Notice: Cart count increases in header

### Step 4: Add More Items
- Repeat steps 2-3 for other products
- Watch cart count grow

### Step 5: View Shopping Cart
- Click **"Cart"** link in navigation
- ✅ Cart page shows all items

### Step 6: Manage Cart
- **Change Quantity:** Edit number in quantity column
- **Remove Item:** Click "Remove" button
- See **Subtotal, Tax, and Total** calculated

---

## 🎬 SECTION 11: Subscribing to Newsletter

### Step 1: Go to Home Page
- Go to: `http://localhost:3000`

### Step 2: Find Newsletter Section
- Scroll down to footer
- Look for newsletter subscription box

### Step 3: Subscribe
- Type your email address
- Click "Subscribe"
- ✅ Email added to newsletter list!

---

## 🎬 SECTION 12: Searching Products

### Step 1: Go to Admin Products
- Admin → Products

### Step 2: Use Search Box
- Type in search box at top: "necklace"
- ✅ Table filters to show only necklaces

### Step 3: Filter by Category
- Use filter dropdown next to search
- Select a category
- ✅ Table shows only that category

---

## 🎬 SECTION 13: Exporting Customers

### Step 1: Go to Customers Admin
- Admin → Customers

### Step 2: Export List
- Click "Export List" button
- ✅ CSV file downloads to your computer

### Step 3: Open in Excel
- Go to Downloads folder
- Open `customers-[date].csv`
- ✅ See all customer data in spreadsheet!

---

## 🎬 SECTION 14: Viewing Statistics

### Step 1: Go to Customers Page
- Admin → Customers

### Step 2: See Stats at Top
- **Total Customers:** Shows number of all customers
- **Active Customers:** Shows number of active customers
- **Newsletter Subscribers:** Shows number of subscribers
- **Average Order Value:** Shows average customer spend

---

## 📋 Quick Reference Checklist

### As Admin
- [ ] Add a product (**+ Add Product**)
- [ ] Edit a product (**✏️ icon**)
- [ ] Delete a product (**🗑️ icon**)
- [ ] Search products (search box)
- [ ] Add a customer (**+ Add Customer**)
- [ ] Edit a customer (**👁️ icon** → **Save**)
- [ ] Delete a customer (**🗑️ icon**)
- [ ] Send newsletter (**📧 Send Newsletter**)
- [ ] Export customers (**Export List**)
- [ ] View statistics (top of customers page)

### As Customer
- [ ] View home page
- [ ] Browse products
- [ ] Click product details
- [ ] Add to cart (**Add to Cart**)
- [ ] View cart (**Cart** link)
- [ ] Change quantity (edit field in cart)
- [ ] Remove from cart (**Remove** button)
- [ ] See totals (Subtotal, Tax, Total)
- [ ] Subscribe to newsletter (footer)

---

## 🆘 Common Problems & Solutions

### "Cannot see Admin button"
**Solution:** 
- Admin button is gold, top right of page
- Make sure you're on home page: http://localhost:3000

### "Product won't add"
**Solution:**
- Both Name and Price are required
- Leave Image URL blank if unsure
- Check browser console (F12) for errors

### "Customer email already exists"
**Solution:**
- Each customer must have unique email
- Use different email: test2@example.com

### "Newsletter button not showing"
**Solution:**
- Newsletter button is only on **Customers** page
- Not on Products page
- Go to: Admin → Customers

### "Server says 'port already in use'"
**Solution:**
```powershell
# Stop server with Ctrl+C
# Then:
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 2
node server/app.js
```

### "Nothing happens when I add product"
**Solution:**
- Look at browser console (F12)
- Server might be down
- Restart server (Ctrl+C, then `node server/app.js`)
- Refresh page (Ctrl+F5)

---

## 🎯 Test Scenario

**Complete workflow to test everything:**

1. **Add 3 products:**
   - Gold Ring ($199.99)
   - Silver Necklace ($149.99)
   - Diamond Earrings ($299.99)

2. **Add 2 customers:**
   - John Smith (john@example.com)
   - Jane Doe (jane@example.com)

3. **Send newsletter:**
   - Subject: "New Products Available"
   - Content: "Check out our latest collection!"

4. **Shop:**
   - Add all 3 products to cart
   - Check total is $649.97 + 8% tax

5. **Export:**
   - Export customer list to CSV
   - Open in Excel to verify

✅ **If all above works, everything is working!**

---

## 📊 Data Examples

### Product Example
```
Name: Sapphire Ring
Category: Rings
Price: 349.99
Stock: 15
Description: Beautiful blue sapphire on platinum band
Image: assets/images/sapphire-ring.jpg
```

### Customer Example
```
Name: Michael Johnson
Email: michael.j@example.com
Phone: (555) 222-3333
Status: Active
Notes: Repeat customer, VIP status
```

### Newsletter Example
```
Subject: Holiday Special - 30% Off Everything!
Content:
---
Dear Valued Customers,

For this holiday season, we're offering 30% off 
all jewelry!

Limited time only. Shop now at our website.

Warm regards,
The Jewelry Store Team
---
```

---

## ✨ Pro Tips

1. **Test Different Scenarios:**
   - Add products with and without images
   - Add customers with special characters in names
   - Try very long descriptions

2. **Use Development Tools:**
   - Press F12 to open developer console
   - Look at Network tab to see API calls
   - Check Console tab for any errors

3. **Export Regularly:**
   - Export customer list periodically
   - Keep backup of data
   - Import into Excel for analysis

4. **Mobile Testing:**
   - Open http://localhost:3000 on phone
   - Test shopping on mobile browser
   - Verify responsive design

5. **Performance:**
   - Add more products and search
   - Add many customers and filter
   - Export large customer lists
   - Notice performance is good!

---

## 🎉 You're Ready!

Follow these steps and you can:
✅ Manage all products
✅ Manage all customers  
✅ Send newsletters
✅ Run your jewelry business
✅ Let customers shop online

**Happy selling! 💎✨**

---

**Need Help?**
- Check USER_GUIDE.md for detailed information
- Check FEATURES.md for all features list
- Open browser console (F12) for error messages
- Check server terminal for any issues

