# WAITPLAY

## **Technical Architecture**

### **1. Customer Flow**
1. **Scan QR Code:** `/frontend/components/TableQRGeneration`
   - Each table has a unique QR code linking to the menu.  
   - Customers scan the QR code to access the menu and place an order.  
3. **Place Order:** `/frontend/pages/ordersocket.js`
   - Once the order is placed, it is sent to the backend for processing.  
4. **Real-Time Order Updates:** `/frontend/pages/[id]/orders.js`
   - Customers receive live updates about their order status (e.g., Confirmed, Preparing, Ready to Serve).  
5. **Call to Waiter:**
   - UI : `/frontend/pages/[id]/orders.js`
   - logic : /backend/routes/userRoute.js`
   - Customers can request waiter assistance directly from their table interface.
   - Waiter calls are sent as real-time notifications to the restaurant staff.

---

### **2. Restaurant Flow**
1. **Admin Panel:** `/frontend/pages/admin` and `/backend/routes/adminRoute.js`
   - Restaurants use the admin panel to manage menu items, track orders, and assign tables.  
   - Real-time notifications alert staff about new orders, waiter calls, and updates.  
2. **Order Management:** `/frontend/pages/[id]/orders.js` and `/backend/routes/orderRoute.js`
   - Staff can update the status of each order, which is reflected in the customer view.  
3. **Menu Management:** `/frontend/pages/[id]/menu.js` and `/backend/routes/menuRoute.js`
   - Dynamic menu system allowing restaurants to add, edit, and remove menu items.
   - Real-time menu updates reflect instantly on customer interfaces.
4. **Analytics & Comparison Features:** `/frontend/pages/id]/dashboard.js` and `/backend/routes/dashboardRoute.js`
   - Comprehensive dashboard showing key metrics (orders, revenue, customers, ratings).
   - Period-over-period comparison functionality (compare with previous month/week/day).
   - Filter-based analytics allowing date range selection for detailed insights.
   - Revenue tracking with visual indicators showing growth/decline trends.
     
---

## **Quick Start**

### **Installation**
```bash
npm install
```

### **Start Server**
```bash
npm start
```

---
