const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Phone = require('../models/Phone');
const User = require('../models/User');

const resetDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear all collections
        console.log('\n=== CLEARING DATABASE ===');
        
        // Clear phones collection
        const phoneCount = await Phone.countDocuments();
        if (phoneCount > 0) {
            await Phone.deleteMany({});
            console.log(`✅ Deleted ${phoneCount} products from phones collection`);
        } else {
            console.log('✅ Phones collection is already empty');
        }

        // Clear users collection (optional - uncomment if you want to clear users too)
        // const userCount = await User.countDocuments();
        // if (userCount > 0) {
        //     await User.deleteMany({});
        //     console.log(`✅ Deleted ${userCount} users from users collection`);
        // } else {
        //     console.log('✅ Users collection is already empty');
        // }

        console.log('\n=== DATABASE RESET COMPLETE ===');
        console.log('✅ Database is now empty and ready for fresh start');
        console.log('✅ Admin can now add products that will appear on customer dashboard');

    } catch (error) {
        console.error('❌ Error resetting database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the function
resetDatabase();

