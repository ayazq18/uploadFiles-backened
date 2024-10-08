const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    url: String,
    size: Number,
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
