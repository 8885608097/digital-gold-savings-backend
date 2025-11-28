const cron = require('node-cron');
const { fetchAndSaveRate } = require('../services/goldService');

cron.schedule('*/5 * * * *', async () => { // every 5 minutes
  try { await fetchAndSaveRate(); console.log('gold rate updated'); } catch(e){ console.error(e); }
});
