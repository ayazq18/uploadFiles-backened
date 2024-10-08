const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    url: String,
    size: Number,
    from:String,
    to:String,
    pathref:String,
    mail:String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
