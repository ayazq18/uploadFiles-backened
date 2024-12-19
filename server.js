const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');  // Import cors
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const folderRoutes = require('./routes/folder');
const { initWebSocket } = require('./services/webSocket');
const File = require('./models/file');

require('dotenv').config();
require('./config/fbPassport');
require('./config/passport');


const app = express();
const server = require('http').Server(app);


initWebSocket(server);
// Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Aggregate queries

async function runAggregateQueries() {
    try {

        // Group files by mail and count the total number of files for each user:

        const groupByEmail = await File.aggregate([
            { $group: { _id: "$mail", totalCount: { $count: {} } } }
        ])

        // Filter files by the mail field to get all files uploaded by a specific user:

        const matchFile = await File.aggregate([
            {$match:{ mail: 'ayazq18@gmail.com'}}
        ])

        // Group files by mail and sum up the size field:
        const totalSize = await File.aggregate([
            {$group: {_id : "$mail", totalSize:{ $sum : "$size"}}}
        ])

        // Sort the files by the size field in descending order and return the largest one:

        const sort = await File.aggregate([
            { $sort: {size: -1}},
            { $limit: 1}
        ])

        // To implement pagination, you can use $skip and $limit:
        const page = 1;
        const limit = 2;
        const pagination = await File.aggregate([
            { $skip: (page -1) * limit},
            { $limit : limit }
        ])

        // total number of files in the collection

        const totalFiles = await File.aggregate([
            {$count: "totalFiles"}
        ])
        console.log('groupByEmail--->', totalFiles)


    } catch (err) {
        console.log(err)
    }
}

runAggregateQueries()
// Routes
app.use('/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Cloud File Manager!');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
