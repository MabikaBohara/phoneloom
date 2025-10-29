const mongoose = require('mongoose');
require('dotenv').config();

const checkDB = async () => {
    try {
        console.log('🔌 Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected successfully\n');

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Collections in database:');
        
        if (collections.length === 0) {
            console.log('   ⚠️  No collections found!\n');
        } else {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
            console.log('');
        }

        // Check users collection specifically
        const User = mongoose.connection.db.collection('users');
        const userCount = await User.countDocuments();
        console.log(`👥 Users collection: ${userCount} documents`);

        if (userCount > 0) {
            const users = await User.find({}).toArray();
            console.log('\n📋 All users in database:');
            users.forEach((user, i) => {
                console.log(`\n   User ${i + 1}:`);
                console.log(`   📧 Email: ${user.email}`);
                console.log(`   👤 Name: ${user.name}`);
                console.log(`   🎭 Role: ${user.role}`);
                console.log(`   🆔 ID: ${user._id}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔒 Connection closed');
    }
};

checkDB();
