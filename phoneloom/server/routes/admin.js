const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/authUtils');
const Phone = require('../models/Phone');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Configure multer for Cloudinary uploads
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ msg: 'File upload error: ' + err.message });
    }
    if (err) {
        return res.status(400).json({ msg: 'File upload error: ' + err.message });
    }
    next();
};

// ============ Phone Admin Routes ============
// Create phone (Admin only)
router.post('/phones', [authMiddleware, adminMiddleware, upload.single('image'), handleMulterError], async (req, res) => {
    try {
        console.log('📱 Admin creating phone...');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // Check for multer errors
        if (req.fileValidationError) {
            return res.status(400).json({ 
                msg: 'File validation error: ' + req.fileValidationError 
            });
        }

        // Validate required fields
        if (!name || !brand || !description || !price || !stock) {
            return res.status(400).json({ 
                msg: 'Missing required fields: name, brand, description, price, stock are required' 
            });
        }

        // Parse arrays from JSON strings if necessary
        let parsedColors = [];
        let parsedStorages = [];
        let parsedRams = [];

        try {
            parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors || [];
            parsedStorages = typeof storageOptions === 'string' ? JSON.parse(storageOptions) : storageOptions || [];
            parsedRams = typeof ramSize === 'string' ? JSON.parse(ramSize) : ramSize || [];
        } catch (parseError) {
            console.error('Error parsing JSON arrays:', parseError);
            return res.status(400).json({ 
                msg: 'Invalid JSON format for colors, storage, or ramSize' 
            });
        }

        const image = req.file ? req.file.path : null;
        if (!image) {
            return res.status(400).json({ msg: 'Image is required' });
        }

        console.log('Creating phone with data:', {
            name, brand, description, price, stock,
            colors: parsedColors, storage: parsedStorages, ramSize: parsedRams,
            image
        });

        const phone = new Phone({
            id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), // Generate unique ID
            name,
            brand,
            model: name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            colors: parsedColors,
            storage: parsedStorages,
            ramSize: parsedRams,
            batterySize,
            batteryType,
            displaySize,
            releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
            image,
            frontCamera,
            backCamera,
            os
        });

        console.log('Saving phone to database...');
        await phone.save();
        console.log(' Phone saved successfully:', phone._id);
        
        res.json(phone);
    } catch (err) {
        console.error(' Error creating phone:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            msg: 'Server error', 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Update phone (Admin only)
router.put('/phones/:id', [authMiddleware, adminMiddleware, upload.single('image'), handleMulterError], async (req, res) => {
    try {
        const { name, model, description, price, brand, stock, colors, storage: storageOptions, ramSize, batterySize, batteryType, displaySize, releaseDate, frontCamera, backCamera, os } = req.body;

        let phone = await Phone.findById(req.params.id);
        if (!phone) {
            return res.status(404).json({ msg: 'Phone not found' });
        }

        // Parse arrays from JSON strings if necessary
        const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        const parsedStorage = typeof storageOptions === 'string' ? JSON.parse(storageOptions) : storageOptions;
        const parsedRamSize = typeof ramSize === 'string' ? JSON.parse(ramSize) : ramSize;

        const updateData = {
            name: name || phone.name,
            model: model || phone.model,
            description: description || phone.description,
            price: price || phone.price,
            brand: brand || phone.brand,
            stock: stock || phone.stock,
            colors: parsedColors || phone.colors,
            storage: parsedStorage || phone.storage,
            ramSize: parsedRamSize || phone.ramSize,
            batterySize: batterySize || phone.batterySize,
            batteryType: batteryType || phone.batteryType,
            displaySize: displaySize || phone.displaySize,
            releaseDate: releaseDate || phone.releaseDate,
            frontCamera: frontCamera || phone.frontCamera,
            backCamera: backCamera || phone.backCamera,
            os: os || phone.os
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        phone = await Phone.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(phone);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete phone (Admin only)
router.delete('/phones/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.id);
        if (!phone) {
            return res.status(404).json({ msg: 'Phone not found' });
        }

        await phone.deleteOne();
        res.json({ msg: 'Phone removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ============ Order Admin Routes ============
// Get all orders (Admin only)
router.get('/orders', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.phone', 'name brand model');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get order details (Admin only)
router.get('/orders/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.phone', 'name brand model');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update order status (Admin only)
router.put('/orders/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email').populate('orderItems.phone', 'name brand model');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ============ Stats Routes ============
// Get monthly sales data (Admin only)
router.get('/stats/sales', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await Order.find({ createdAt: { $gte: sixMonthsAgo } });
        const salesByMonth = {};

        orders.forEach(order => {
            const month = new Date(order.createdAt).toLocaleString('en-US', { month: 'short' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = { sales: 0, orders: 0 };
            }
            salesByMonth[month].sales += order.totalPrice;
            salesByMonth[month].orders += 1;
        });

        const salesData = Object.keys(salesByMonth).map(month => ({
            month,
            sales: salesByMonth[month].sales,
            orders: salesByMonth[month].orders
        }));

        res.json(salesData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get brand sales data (Admin only)
router.get('/stats/brands', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const orders = await Order.find({}).populate('orderItems.phone', 'brand');
        const brandCounts = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const brand = item.phone?.brand;
                if (brand) {
                    if (!brandCounts[brand]) {
                        brandCounts[brand] = 0;
                    }
                    brandCounts[brand] += item.quantity;
                }
            });
        });

        const brandData = Object.keys(brandCounts).map(brand => ({
            brand,
            count: brandCounts[brand]
        }));

        res.json(brandData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get total users (Admin only)
router.get('/stats/users', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;



