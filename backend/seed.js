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
            console.log('Demo user already exists');
        } else {
            // Create demo user
            const user = await User.create({
                email: demoEmail,
                password: 'password123',
                fullName: 'Demo Student',
                university: 'CampusLoop University',
                campus: 'Main Campus',
                course: 'Computer Science',
                semester: '4th Semester',
                interests: ['Coding', 'Design', 'Music'],
                bio: 'This is a demo account for testing features.',
                isVerified: true
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
