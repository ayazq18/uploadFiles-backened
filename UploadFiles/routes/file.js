const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.get('/download/:id', fileController.downloadFile);
router.get('/fetchAll', fileController.getFiles);
router.delete('/:id', fileController.deleteFile);
router.post('/folder-zip/:folderId', fileController.downloadFolderAsZip);

module.exports = router;
