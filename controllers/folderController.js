const Folder = require('../models/folder');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('files');
const archiver = require('archiver');
const axios = require("axios");

const { getIO } = require('../services/webSocket');

exports.createFolder = async (req, res) => {
  try {
    let progress;
    getIO().emit("upload-progress-folder", progress);

    const folder = await Folder.create({
      name: req.body.name,
      mail: req.body.mail,
      files: [],
    });
    progress = 100;
    getIO().emit("upload-progress-folder", progress);
    res.status(201).json(folder)
  } catch (err) {
    console.error("Error creating folder:", err);
    getIO().emit("upload-progress-folder", "");
    res.status(500).json({ error: 'Failed to create folder', details: err.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({ error: 'Failed to fetch folders', details: err.message });
  }
};

exports.deleteFolder = async (req, res) => {
  const { id } = req.params;
  try {
    await Folder.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ error: 'Failed to delete folder', details: err.message });
  }
};

exports.deleteFileFromFolder = async (req, res) => {
  const { fileId, folderName } = req.params;
  try {
    let progress = 0;
    getIO().emit("delete-progress-file", progress);

    let fromfolder = await Folder.findOne({ name: folderName });
    progress = 20;
    getIO().emit("upload-progress-file", progress);
    const filesToupdatefrom = fromfolder.files.filter((file) => file._id.toString() !== fileId.toString());
    progress = 60;
    getIO().emit("upload-progress-file", progress);
    await Folder.findOneAndUpdate(
      { name: folderName },
      { $set: { files: filesToupdatefrom } },
      { new: true }
    );
    progress = 100;
    getIO().emit("upload-progress-file", progress);

    res.status(204).send({ message: 'File Deleted Successfully' });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ error: 'Failed to delete folder', details: err.message });
  }
};


exports.downloadFolderAsZip = async (req, res) => {
  const { folderId } = req.params;
  try {
    progress = 0;
    getIO().emit("download-progress-file", progress);
    const folder = await Folder.findById(folderId);
    if (folder.files.length === 0) {
      return res.status(404).json({ message: 'Folder or files not found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${folder.name}.zip`);
    progress = 20;
    getIO().emit("download-progress-file", progress);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);
    progress = 60;
    getIO().emit("download-progress-file", progress);
    for (const file of folder.files) {
      const response = await axios({
        method: 'GET',
        url: file.url,
        responseType: 'arraybuffer',
      });

      archive.append(response.data, { name: file.name });
    }
    progress = 80;
    getIO().emit("download-progress-file", progress);
    await archive.finalize();
    progress = 100;
    getIO().emit("download-progress-file", progress);
  } catch (err) {
    console.error('Error downloading folder as ZIP:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download ZIP file', details: err.message });
    }
  }
};