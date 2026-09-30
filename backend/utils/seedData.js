import User from '../models/User.js';
import Category from '../models/Category.js';
import Counter from '../models/Counter.js';

export const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      return;
    }

    console.log('Seeding clean SupportDesk data...');

    // 1. Categories (Only Laptop and Mobile)
    await Category.deleteMany({});
    await Category.insertMany([
      { name: 'Laptop Issue', description: 'Laptop screen, battery, keyboard, performance, or OS problems' },
      { name: 'Mobile Issue', description: 'Mobile screen, battery, network, app crash, or heating problems' },
    ]);

    // 2. Permanent Admin & Agent only
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      role: 'admin',
      department: 'Management',
      phone: '',
      status: 'active',
    });

    await User.create({
      name: 'Agent Support',
      email: 'agent@gmail.com',
      password: 'agent@123',
      role: 'agent',
      department: 'Technical Support',
      phone: '',
      status: 'active',
    });

    await User.create({
      name: 'akash',
      email: 'ak@gmail.com',
      password: 'admin@123',
      role: 'user',
      department: 'General',
      phone: '',
      status: 'active',
    });

    // 3. Counter initialized
    const counter = await Counter.findById('ticketId');
    if (!counter) {
      await Counter.create({ _id: 'ticketId', seq: 1000 });
    }

    console.log('Default Admin and Agent initialized successfully.');
  } catch (error) {
    console.error('Seed Database error:', error.message);
  }
};
