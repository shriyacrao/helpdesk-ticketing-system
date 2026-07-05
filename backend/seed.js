// Run with: npm run seed
// Creates a default admin, agent, and user account for quick testing.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedUsers = [
  { name: 'Admin User', email: 'admin@helpdesk.com', password: 'password123', role: 'admin' },
  { name: 'Agent Smith', email: 'agent@helpdesk.com', password: 'password123', role: 'agent' },
  { name: 'Regular User', email: 'user@helpdesk.com', password: 'password123', role: 'user' },
];

const run = async () => {
  await connectDB();

  for (const u of seedUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`Skipping (already exists): ${u.email}`);
      continue;
    }
    await User.create(u);
    console.log(`Created: ${u.email} / password123 (role: ${u.role})`);
  }

  await mongoose.connection.close();
  console.log('Seeding complete.');
};

run();
