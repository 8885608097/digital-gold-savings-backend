# Digital Gold Savings Backend (Node.js + Express + MongoDB)

This is the backend service for **Digital Gold Savings Platform**, where users can securely buy, sell, store, and track digital gold.  
The system includes authentication, wallet management, gold transactions, KYC verification, invoices, savings plans, and admin modules.

---

## 🚀 Features

### 🔐 Authentication & Security
- User Signup / Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Role-based Access (User / Admin)

### 💰 Wallet Management
- Add Money to Wallet
- Deduct Balance during Gold Purchase
- Wallet History Tracking

### 🪙 Gold Management
- Buy Gold (Live Price Integration if added)
- Sell Gold
- Gold Holdings Summary
- Gold Holding History

### 🧾 Invoices
- Auto-generate invoices for each transaction
- Download / View stored invoices

### 📂 KYC Management
- Upload KYC documents
- Admin Approval / Rejection

### 📝 Savings Plans
- Create Savings Plans
- Auto-debit from wallet (if enabled)
- Track user’s gold savings

### 🛠 Admin Features
- View All Users
- Approve KYC
- View Gold Transactions
- Dashboard APIs

---

## 🧱 Folder Structure

