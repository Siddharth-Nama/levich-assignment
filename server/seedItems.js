const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');
const connectDB = require('./config/db');

dotenv.config();

const items = [
  {
    title: 'Vintage Camera',
    startingPrice: 100,
    endTime: new Date(Date.now() + 1000 * 60 * 60), // Ends in 1 hour
  },
  {
    title: 'Rare Coin',
    startingPrice: 50,
    endTime: new Date(Date.now() + 1000 * 60 * 30), // Ends in 30 mins
  },
  {
    title: 'Signed Poster',
    startingPrice: 200,
    endTime: new Date(Date.now() + 1000 * 60 * 5), // Ends in 5 mins (good for testing)
  },
  {
    title: 'Gaming Console',
    startingPrice: 300,
    endTime: new Date(Date.now() + 1000 * 60 * 15), // Ends in 15 mins
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Item.deleteMany({});
    console.log('Items cleared');

    await Item.insertMany(items);
    console.log('Items seeded');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
