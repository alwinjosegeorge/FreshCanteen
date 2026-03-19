require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Announcement = require('./models/Announcement');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ─── Menu Routes ─────────────────────────────────────────────────────────────

app.get('/api/menu', async (req, res) => {
    try {
        const menu = await MenuItem.find().sort({ createdAt: -1 });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/menu', async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/menu/:id', async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/menu/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Order Routes ────────────────────────────────────────────────────────────

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── Announcement Routes ─────────────────────────────────────────────────────

app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/announcements', async (req, res) => {
    try {
        const newAnnouncement = new Announcement(req.body);
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── User/Auth Routes ───────────────────────────────────────────────────────

app.post('/api/users/login', async (req, res) => {
    try {
        const { admissionNumber, password } = req.body;
        if (!admissionNumber) return res.status(400).json({ error: "Admission number is required" });

        const possibleIds = [
            admissionNumber.toUpperCase(),
            `SJC${admissionNumber.toUpperCase()}`,
            admissionNumber.toUpperCase().replace(/^SJC/, '')
        ];

        let user = await User.findOne({ admissionNumber: { $in: possibleIds } });

        if (!user) {
            return res.status(404).json({ error: "Student not found. Please check your Admission Number." });
        }

        if (password && user.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Loyalty Routes ──────────────────────────────────────────────────────────

app.get('/api/loyalty/:admissionNumber', async (req, res) => {
    try {
        const user = await User.findOne({ admissionNumber: req.params.admissionNumber });
        if (user) {
            res.json({ admissionNumber: user.admissionNumber, points: user.points, totalEarned: user.totalEarned });
        } else {
            res.json({ admissionNumber: req.params.admissionNumber, points: 0, totalEarned: 0 });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/loyalty/update', async (req, res) => {
    const { admissionNumber, pointsToAdd, pointsToRedeem } = req.body;
    try {
        let user = await User.findOne({ admissionNumber });
        if (!user) {
            user = new User({ admissionNumber, name: 'Student', points: 0, totalEarned: 0 });
        }

        if (pointsToAdd) {
            user.points += pointsToAdd;
            user.totalEarned += pointsToAdd;
        }
        if (pointsToRedeem) {
            if (user.points >= pointsToRedeem) {
                user.points -= pointsToRedeem;
            } else {
                return res.status(400).json({ error: "Insufficient points" });
            }
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
