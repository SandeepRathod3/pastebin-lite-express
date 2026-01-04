const express = require('express');
const router = express.Router();
const PasteController = require('../controllers/pasteController');

router.get('/', PasteController.healthCheck);

module.exports = router;