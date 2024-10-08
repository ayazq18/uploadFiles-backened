const express = require('express');
const folderController = require('../controllers/folderController');
const router = express.Router();

router.post('/create', folderController.createFolder);
router.get('/fetchAll', folderController.getFolders);
router.delete('/:id', folderController.deleteFolder);
router.delete('/file/:fileId/:folderName', folderController.deleteFileFromFolder);
router.get('/folder-zip/:folderId', folderController.downloadFolderAsZip);

module.exports = router;
