// backend/src/sync.js
import { sequelize } from './models/index.js';
import { User }      from './models/User.js';

(async () => {
  try {
    // WARNING: force: true DROPS existing tables!
    await sequelize.sync({ force: true });
    console.log('✅ Database force-synced (tables dropped & recreated).');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error force-syncing database:', err);
    process.exit(1);
  }
})();
