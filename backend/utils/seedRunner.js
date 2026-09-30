import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seed runner failed:', err);
    process.exit(1);
  }
};

runSeed();
