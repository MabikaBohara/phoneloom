const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Phone = require('../models/Phone');

// Load environment variables
require('dotenv').config();



// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phoneloom');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Import into DB
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Phone.deleteMany();

    // Flatten the phone data
    const allPhones = Object.values(phones).flat();

    // Add random ratings
    const phonesWithRating = allPhones.map(phone => ({
      ...phone,
      rating: +(Math.random() * (4.8 - 3.5) + 3.5).toFixed(1) // keep one decimal place
    }));


    
    

    process.exit(0);
  } catch (error) {
    console.error('Import Error:', error);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await connectDB();
    await Phone.deleteMany();
    process.exit(0);
  } catch (error) {
    console.error('Destroy Error:', error);
    process.exit(1);
  }
};

// Run with "node seed.js" or "node seed.js -d"
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
