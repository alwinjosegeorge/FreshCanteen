require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const initialItems = [
    { name: "Avocado Harvest Bowl", price: 12.50, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", category: "Meals", tags: ["VEGAN"], calories: 450, available: true },
    { name: "Classic Smash Burger", price: 13.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", category: "Meals", tags: ["BEEF"], calories: 720, available: true },
    { name: "Vanilla Iced Coffee", price: 5.00, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600", category: "Drinks", tags: ["CAFFEINATED"], calories: 150, available: true },
    { name: "Fresh Mango Smoothie", price: 4.25, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600", category: "Drinks", tags: ["FRESH"], calories: 210, available: true }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        const count = await MenuItem.countDocuments();
        if (count === 0) {
            await MenuItem.insertMany(initialItems);
            console.log('Seeded initial menu items');
        } else {
            console.log('Database already has items, skipping seed');
        }

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
