const express = require('express');
const app = express();
const router = express.Router();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const goodbye = () => {
  console.log('Thank you so much for using this application.');
  return;
}

module.exports = { goodbye };
module.exports = router;