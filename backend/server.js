/**
 * CampusLoop Backend Server
 * Main entry point
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const postRoutes = require('./routes/posts');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'CampusLoop API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to CampusLoop API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            activities: '/api/activities',
            users: '/api/users',
            messages: '/api/messages',
            notifications: '/api/notifications',
            health: '/api/health'
        }
    });
});

// Socket.IO for real-time features
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room
    socket.on('join', (userId) => {
        socket.join(userId);
        connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} joined`);
    });

    // Join activity chat room
    socket.on('joinActivity', (activityId) => {
        socket.join(`activity_${activityId}`);
        console.log(`Socket joined activity: ${activityId}`);
    });

    // Leave activity chat room
    socket.on('leaveActivity', (activityId) => {
        socket.leave(`activity_${activityId}`);
        console.log(`Socket left activity: ${activityId}`);
    });

    // Handle new message — broadcast to others only, sender already has it optimistically
    socket.on('sendMessage', (data) => {
        socket.to(`activity_${data.activityId}`).emit('newMessage', data);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        socket.to(`activity_${data.activityId}`).emit('userTyping', {
            userId: data.userId,
            userName: data.userName
        });
    });

    // Handle stop typing
    socket.on('stopTyping', (data) => {
        socket.to(`activity_${data.activityId}`).emit('userStopTyping', {
            userId: data.userId
        });
    });

    socket.on('disconnect', () => {
        const userId = connectedUsers.get(socket.id);
        connectedUsers.delete(socket.id);
        console.log('User disconnected:', socket.id, userId);
    });
});

// Make io accessible to routes
app.set('io', io);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
🚀 CampusLoop Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port ${PORT}
✅ Environment: ${process.env.NODE_ENV || 'development'}
✅ Socket.IO enabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

module.exports = { app, server, io };
