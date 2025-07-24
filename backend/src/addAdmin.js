// src/addAdmin.js
import { User } from './models/User.js';
import { sequelize } from './models/index.js';

const run = async () => {
  try {
    await sequelize.sync(); // ensure DB connection

    const admin = await User.create({
      fullName: 'Admin Clinton',
      address: '123 Admin Street',
      state: 'Lagos',
      zip: '100001',
      homePhone: '08000000000',
      cellPhone: '08011111111',
      email: 'ezeobiclinton@gmail.com',
      password: 'Chid1234.', // ⛔️ do not hash it manually
      isAdmin: true,
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