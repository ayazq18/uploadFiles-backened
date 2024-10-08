const File = require('../models/file');
const cloudStorage = require('../services/cloudStorage');
const archiver = require('archiver');
const fs = require('fs');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

exports.uploadFile = (req, res) => {
    // Use multer directly inside the controller
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed', details: err.message });
        }

        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            // Upload the file to S3 using the cloudStorage service
            const result = await cloudStorage.uploadFileToS3(req.file);

            // Debug: Log the uploaded file
            // Create the file record in your database
            const file = await File.create({
                name: req.file.originalname,  // Original file name
                url: result.Location,         // S3 URL (returned from upload result)
                size: req.file.size,          // File size
                // owner: req.user._id,          // Assuming you have an authenticated user
            });

            // Return success response with the file object
            res.status(201).json(file);
        } catch (err) {
            // Handle any errors
            res.status(500).json({ error: err.message });
        }
    });
};

exports.downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
        res.redirect(file.url);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        await cloudStorage.deleteFileFromS3(file.name);
        await file.remove();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadFolderAsZip = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.folderId).populate('files');
        const archive = archiver('zip');
        res.attachment(`${folder.name}.zip`);
        archive.pipe(res);

        folder.files.forEach((file) => {
            archive.append(request(file.url), { name: file.name });
        });

        archive.finalize();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
