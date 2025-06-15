const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const users = [
  { email: 'luffy@onepiece.com', username: 'luffy', password: 'gomunomi' },
  { email: 'zoro@onepiece.com', username: 'zoro', password: 'santoryu' },
  { email: 'nami@onepiece.com', username: 'nami', password: 'navigation' },
  { email: 'sanji@onepiece.com', username: 'sanji', password: 'blackleg' },
  { email: 'robin@onepiece.com', username: 'robin', password: 'poneglyph' },
  { email: 'usopp@onepiece.com', username: 'usopp', password: 'sniperking' },
  { email: 'chopper@onepiece.com', username: 'chopper', password: 'doctony' },
  { email: 'franky@onepiece.com', username: 'franky', password: 'super!' },
  { email: 'brook@onepiece.com', username: 'brook', password: 'yohoho' },
  { email: 'jinbe@onepiece.com', username: 'jinbe', password: 'whirlpool' }
];

const seedUsers = async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query(
        'INSERT INTO users (id, email, username, password) VALUES ($1, $2, $3, $4)',
        [uuidv4(), user.email, user.username, hashedPassword]
      );
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    db.end();
  }
};

seedUsers();
