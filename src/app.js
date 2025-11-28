const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const goldRoutes = require('./routes/gold');
const kycRoutes = require("./routes/kyc");
const savingsRoutes = require("./routes/savingsPlan");
const transactionRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");
const invoiceRoutes = require("./routes/invoice");
// const adminRoutes = require('./routes/admin');  // REMOVE THIS

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/gold', goldRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invoice", invoiceRoutes);
// app.use('/api/admin', adminRoutes);  // REMOVE THIS

app.get('/', (req, res) => res.send('Digital Gold Backend OK'));

module.exports = app;
