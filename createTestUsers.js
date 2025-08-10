const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');
require('dotenv').config();

async function createTestUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@nehemiaministry.org' });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            // Create admin user
            const adminUser = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@nehemiaministry.org',
                password: 'admin123',
                role: 'admin',
                phone: '+254700000000',
                ministry: 'administration',
                isActive: true,
                memberSince: new Date()
            });

            await adminUser.save();
            console.log('✅ Admin user created: admin@nehemiaministry.org / admin123');
        }

        // Check if test member already exists
        const existingMember = await User.findOne({ email: 'member@test.com' });
        if (existingMember) {
            console.log('Test member already exists');
        } else {
            // Create test member
            const memberUser = new User({
                firstName: 'John',
                lastName: 'Doe',
                email: 'member@test.com',
                password: 'member123',
                role: 'member',
                phone: '+254700000001',
                ministry: 'youth',
                isActive: true,
                memberSince: new Date()
            });

            await memberUser.save();
            console.log('✅ Test member created: member@test.com / member123');
        }

        console.log('\n🎉 Test users ready!');
        console.log('\n📋 Login Credentials:');
        console.log('👑 Admin: admin@nehemiaministry.org / admin123');
        console.log('👤 Member: member@test.com / member123');
        console.log('\n🌐 URLs:');
        console.log('📱 Main Site: http://localhost:3000');
        console.log('⚡ Admin Panel: http://localhost:3000/admin');
        console.log('📊 Member Dashboard: http://localhost:3000/dashboard');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error);
        process.exit(1);
    }
}

createTestUsers();
