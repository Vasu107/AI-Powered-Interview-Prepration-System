const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const client = new MongoClient('mongodb://localhost:27017/AskUp_Virtual_Interview');
  
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    const adminEmail = 'askupteam396@gmail.com';
    const adminPassword = 'admin123';
    
    // Check if admin exists
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return;
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await db.collection('users').insertOne({
      name: 'AskUp Admin',
      email: adminEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin();