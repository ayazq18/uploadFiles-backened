const express = require('express');
const folderController = require('../controllers/folderController');
const router = express.Router();

router.post('/create', folderController.createFolder);
router.get('/:id', folderController.getFolder);
router.delete('/:id', folderController.deleteFolder);

module.exports = router;
