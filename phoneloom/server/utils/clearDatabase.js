const mongoose = require('mongoose');
require('dotenv').config();

// Import Phone model
const Phone = require('../models/Phone');

const clearDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Count existing products
        const productCount = await Phone.countDocuments();
        console.log(`Found ${productCount} products in database`);

        if (productCount === 0) {
            console.log('Database is already empty!');
            return;
        }

        // Delete all products
        const result = await Phone.deleteMany({});
        console.log(`Deleted ${result.deletedCount} products from database`);
        console.log('Database cleared successfully!');

    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the function
clearDatabase();
