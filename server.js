const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');  // Import cors
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const folderRoutes = require('./routes/folder');
const { initWebSocket } = require('./services/webSocket');
require('dotenv').config();
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
