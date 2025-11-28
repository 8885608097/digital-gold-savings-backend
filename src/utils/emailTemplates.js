module.exports = {
  kycApproved: (name) => `
    <h2>Hi ${name},</h2>
    <p>Your KYC has been <b style="color:green;">APPROVED</b>.</p>
    <p>You can now buy/sell gold with full access.</p>
  `,

  kycRejected: (name) => `
    <h2>Hi ${name},</h2>
    <p>Your KYC was <b style="color:red;">REJECTED</b>.</p>
    <p>Please upload clear documents and retry.</p>
  `,

  goldPurchase: (name, grams, amount) => `
    <h2>Gold Purchase Successful!</h2>
    <p>Hi ${name}, you bought <b>${grams} grams</b> of gold.</p>
    <p>Amount paid: <b>₹${amount}</b></p>
  `,

  goldSell: (name, grams, amount) => `
    <h2>Gold Sold Successfully!</h2>
    <p>You sold <b>${grams} grams</b> of gold.</p>
    <p>Amount credited: <b>₹${amount}</b></p>
  `,

  savingsEMISuccess: (name, amount) => `
    <h2>EMI Auto Debit Successful</h2>
    <p>Dear ${name}, your EMI of <b>₹${amount}</b> was debited successfully.</p>
  `,

  savingsEMIFailed: (name, amount) => `
    <h2>EMI Auto Debit Failed</h2>
    <p>Dear ${name}, your EMI of <b>₹${amount}</b> failed due to insufficient balance.</p>
  `,
};
