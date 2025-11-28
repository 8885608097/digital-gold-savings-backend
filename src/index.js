require("dotenv").config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');

    // Start server
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));


    require("./jobs/autoDebitJob");
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
