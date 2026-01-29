const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');
const connectDB = require('./config/db');

dotenv.config();

const MAX_ITEMS = 100;

const adjectives = ['Vintage', 'Rare', 'Antique', 'Collectible', 'Signed', 'Limited Edition', 'Retro', 'Modern', 'Futuristic', 'Legendary', 'Golden', 'Silver', 'Diamond', 'Broken', 'Haunted'];
const nouns = ['Camera', 'Watch', 'Coin', 'Poster', 'Guitar', 'Sneakers', 'Console', 'Laptop', 'Painting', 'Sculpture', 'Bike', 'Car', 'Drone', 'Smartphone', 'Chair', 'Table', 'Lamp', 'Keyboard', 'Monitor', 'Headphones'];

const generateItems = () => {
  const items = [];
  for (let i = 0; i < MAX_ITEMS; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    const startingPrice = Math.floor(Math.random() * 990) + 10;
    
    const duration = Math.floor(Math.random() * (24 * 60 - 2) + 2) * 60 * 1000;
    const endTime = new Date(Date.now() + duration);

    items.push({
      title: `${adj} ${noun} #${i + 1}`,
      startingPrice: startingPrice,
      currentBid: startingPrice,
      endTime: endTime
    });
  }
  return items;
};

const items = generateItems();

const seedData = async () => {
  try {
    await connectDB();

    await Item.deleteMany({});
    console.log('Items cleared');

    await Item.insertMany(items);
    console.log(`${items.length} items seeded successfully`);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
