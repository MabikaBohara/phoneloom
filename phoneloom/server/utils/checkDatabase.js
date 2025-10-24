const mongoose = require('mongoose');
require('dotenv').config();

// Import Phone model
const Phone = require('../models/Phone');

const checkDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Count products
        const productCount = await Phone.countDocuments();
        console.log(`\n📊 Database Status:`);
        console.log(`   Products in database: ${productCount}`);

        if (productCount === 0) {
            console.log('\n✅ Database is EMPTY - Perfect!');
            console.log('✅ Admin can now add products that will appear on customer dashboard');
            console.log('✅ No existing products will interfere with testing');
        } else {
            console.log(`\n⚠️  Database has ${productCount} products`);
            console.log('   Run: node utils/clearDatabase.js to clear them');
        }

        // Show sample products if any exist
        if (productCount > 0) {
            const sampleProducts = await Phone.find({}).limit(3).select('model brand price');
            console.log('\n📱 Sample products:');
            sampleProducts.forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.brand} ${product.model} - $${product.price}`);
            });
        }

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

// Run the function
checkDatabase();

