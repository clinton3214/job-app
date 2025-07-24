// src/addAdmin.js
import bcrypt from 'bcrypt';
import { User } from './models/User.js';
import { sequelize } from './models/index.js';

const run = async () => {
  try {
    const password = 'Chid1234.';// always remember to run node src/addAdmin.js in your backend terminal directory to update
    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.sync(); // ensure DB connection

    const admin = await User.create({
      name: 'Admin',
      email: 'ezeobiclinton@gmail.com',
      password: hashedPassword,
      isAdmin: true, // Only if your User model has this field
      fullName: 'Admin Clinton',
      address: '123 Admin Street',
      state: 'Lagos',
      zip: '100001',
      homePhone: '08000000000',
      cellPhone: '08011111111',
      referralCode: 'adminRef001'
    });

    console.log('✅ Admin user created:', admin.email);
  } catch (err) {
    console.error('❌ Failed to create admin user:', err);
  } finally {
    process.exit();
  }
};

run();

