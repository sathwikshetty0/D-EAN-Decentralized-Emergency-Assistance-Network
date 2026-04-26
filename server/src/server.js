const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/responders', require('./routes/responders'));
app.use('/api/admin', require('./routes/admin'));

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'D-EAN API is running' });
});

const PORT = process.env.PORT || 5000;

// Initialize Socket.io
const { initSocket } = require('./socket/socketHandler');
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
