const express = require('express');
const router = express.Router();

router.use(require('./department'));
router.use(require('./roles'));
router.use(require('./employee'));


module.exports = router;