const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();
const { requireIndusLicense } = require('./lib/indus_license');

// Connect to database
connectDB();

const app = express();

// Security middleware
// helmet blocks some inline scripts by default which might interfere with bootstrap/cdn scripts, configuring it for demo.
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/verify', require('./routes/verifyRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

requireIndusLicense(__dirname)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err.message || err);
        process.exit(1);
    });
