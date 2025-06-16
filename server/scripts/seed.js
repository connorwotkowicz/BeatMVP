const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const users = [
  { email: 'luffy@onepiece.com', password: 'gomunomi' },
  { email: 'zoro@onepiece.com', password: 'santoryu' },
  { email: 'nami@onepiece.com', password: 'navigation' },
  { email: 'sanji@onepiece.com', password: 'blackleg' },
  { email: 'robin@onepiece.com', password: 'poneglyph' },
  { email: 'usopp@onepiece.com', password: 'sniperking' },
  { email: 'chopper@onepiece.com', password: 'doctony' },
  { email: 'franky@onepiece.com', password: 'super!' },
  { email: 'brook@onepiece.com', password: 'yohoho' },
  { email: 'jinbe@onepiece.com', password: 'whirlpool' }
];

const seedUsers = async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query(
        'INSERT INTO users (id, email, password) VALUES ($1, $2, $3)',
        [uuidv4(), user.email, hashedPassword]
      );
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    db.end()
      .then(() => console.log('Pool closed. Seeding complete.'))
      .catch((err) => console.error('Error closing pool:', err));
  }
};

seedUsers();
