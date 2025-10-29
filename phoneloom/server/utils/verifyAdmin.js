const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@phoneloom.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'strongPassword123!';

        // Find the admin user
        const admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            console.log('❌ Admin user NOT found in database!');
            return;
        }

        console.log('✅ Admin user found:');
        console.log('   📧 Email:', admin.email);
        console.log('   👤 Name:', admin.name);
        console.log('   🎭 Role:', admin.role);
        console.log('   🔑 Password Hash (first 50 chars):', admin.password.substring(0, 50) + '...');
        console.log('   🆔 ID:', admin._id);
        console.log('');

        // Test password comparison
        console.log('🔍 Testing password comparison...');
        console.log('   Plain password from .env:', adminPassword);
        
        const isMatch = await bcrypt.compare(adminPassword, admin.password);
        
        if (isMatch) {
            console.log('   ✅ Password comparison: SUCCESS');
            console.log('   👍 Login should work!');
        } else {
            console.log('   ❌ Password comparison: FAILED');
            console.log('   ⚠️  The password in database does not match the .env password');
            console.log('   💡 Run createAdmin.js again to fix this');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔒 Database connection closed');
    }
};

verifyAdmin();
