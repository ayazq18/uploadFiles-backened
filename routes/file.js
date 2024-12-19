const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.get('/fetchAll', fileController.getFiles);
router.delete('/:id', fileController.deleteFile);
router.put('/update-pathref', fileController.updatePathref)
module.exports = router;
