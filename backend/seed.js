const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const seedUser = async () => {
    try {
        await connectDB();

        const demoEmail = 'demo@university.edu';
        const userExists = await User.findOne({ email: demoEmail });

        if (userExists) {
            // Ensure demo user is verified even after new auth system
            if (!userExists.emailVerified) {
                userExists.emailVerified = true;
                userExists.isVerified    = true;
                await userExists.save({ validateBeforeSave: false });
                console.log('Demo user updated: email marked as verified');
            } else {
                console.log('Demo user already exists and is verified');
            }
        } else {
            await User.create({
                email:         demoEmail,
                password:      'password123',
                fullName:      'Demo Student',
                university:    'City University Malaysia',
                campus:        'Petaling Jaya Campus',
                course:        'Computer Science',
                semester:      'Semester 4',
                interests:     ['Coding', 'Design', 'Music'],
                bio:           'Demo account for testing.',
                isVerified:    true,
                emailVerified: true,
            });
            console.log('Demo user created successfully');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedUser();
