const express = require('express');
const router = express.Router();

router.use(require('./department'));
router.use(require('./role'));
router.use(require('./employee'));


module.exports = router;