const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(' Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@phoneloom.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        // Remove ALL existing admin users first
        const deletedAdmins = await User.deleteMany({ role: 'admin' });
        console.log(` Removed ${deletedAdmins.deletedCount} existing admin user(s)`);

        // Create the single admin user from .env
        console.log('\n🔨 Creating admin user...');
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);
        console.log('   Role: admin');
        
        const adminUser = new User({
            name: 'Admin',
            email: adminEmail,
            password: adminPassword, // This will be hashed by the pre-save hook
            role: 'admin'
        });

        console.log('\n💾 Saving admin to database...');
        const savedAdmin = await adminUser.save();
        console.log('✅ Save operation completed!');
        console.log('   Saved ID:', savedAdmin._id);
        
        // Verify it was saved
        const verifyAdmin = await User.findById(savedAdmin._id);
        if (verifyAdmin) {
            console.log('✅ Verification: Admin found in database!');
        } else {
            console.log('❌ Verification: Admin NOT found in database!');
        }
        
        console.log('\n✅ Admin user created successfully!');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('👤 Role: admin');
        console.log('\n⚠️  ONLY this admin can log in. No other admin accounts exist.');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the function
createAdmin();




