const Folder = require('../models/folder');

exports.createFolder = async (req, res) => {
    try {
        const folder = await Folder.create({
            name: req.body.name,
            owner: req.user._id,
        });
        res.status(201).json(folder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id).populate('files');
        res.status(200).json(folder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFolder = async (req, res) => {
    try {
        await Folder.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Folder deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
