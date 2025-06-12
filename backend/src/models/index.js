// backend/src/models/index.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/database.sqlite',  // file will be created in backend/data/
  logging: false,
});

// Export initialized models after calling .sync()
export async function initDb() {
  // Import models (so they register themselves)
  await Promise.all([
    import('./User.js'),
    import('./AdminLog.js'),
    import('./Payment.js'),
  ]);
  // Create tables if they don't exist
  await sequelize.sync();
}
