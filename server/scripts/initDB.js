const fs = require('fs');
const path = require('path');
const db = require('../config/db'); 

const initDb = async () => {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await db.query(schema);
    console.log('Database schema initialized!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    db.end(); 
  }
};

initDb();
