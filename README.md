# Digital Gold Savings Backend (Node.js + Express + MongoDB)

This is the backend service for **Digital Gold Savings Platform**, where users can securely buy, sell, store, and track digital gold.  
The system includes authentication, wallet management, gold transactions, KYC verification, invoices, savings plans, and admin modules.

---

##  Features

###  Authentication & Security
- User Signup / Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Role-based Access (User / Admin)

###  Wallet Management
- Add Money to Wallet
- Deduct Balance during Gold Purchase
- Wallet History Tracking

###  Gold Management
- Buy Gold (Real-time Gold Rate Integration)
- Sell Gold
- Gold Holdings Overview
- Gold Transaction History

###  KYC Verification
- Upload KYC Documents (Aadhaar Front/Back, PAN, Passport etc.)
- Store File URLs in DB
- Admin Approve / Reject KYC
- KYC Status API

###  Savings Plans (EMI / Auto-Debit)
- Create Monthly Savings Plan
- Auto-debit using Cron Jobs
- EMI Payment Tracking
- Savings Summary & History

###  Invoices
- Auto-generate invoices for each transaction
- View / Download invoices
- Store invoice metadata in DB

###  Admin Dashboard
- Fetch All Users
- Approve / Reject KYC
- Approve / Reject Savings EMI
- View All Transactions
- Admin-only role-based API access

###  Gold Rate Integration
- Real-time Gold Rate API
- Fallback to Last Saved Rate if API Fails
- Cached Gold Rate Fetching
---

##  Folder Structure
src/
│
├── app.js
├── index.js
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
├── invoices/
└── jobs/
---

### Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (File Uploads)
- JWT Authentication
- Cron Jobs
- Nodemailer (Email Notifications)
---

### Key APIs Implemented
### Auth
- POST /api/auth/register
- POST /api/auth/login
### Wallet
- POST /api/wallet/add
- GET /api/wallet/balance
### Gold
- POST /api/gold/buy
- POST /api/gold/sell
### KYC
- POST /api/kyc/upload
- GET /api/kyc/status
- POST /api/kyc/:kycId/approve
- POST /api/kyc/:kycId/reject
### Savings
- POST /api/savings/create
- GET /api/savings/history
### Transactions
- GET /api/transactions/all
---



