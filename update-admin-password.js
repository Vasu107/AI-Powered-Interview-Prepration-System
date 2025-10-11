const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  const client = new MongoClient('mongodb://localhost:27017/AskUp_Virtual_Interview');
  
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    const hashedPassword = await bcrypt.hash('askup@12345', 12);
    
    const result = await db.collection('users').updateOne(
      { email: 'askupteam396@gmail.com' },
      { 
        $set: { 
          name: 'AskUp Admin',
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('Admin updated:', result.modifiedCount > 0 ? 'Success' : 'Not found');
    console.log('Email: askupteam396@gmail.com');
    console.log('Password: askup@12345');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateAdminPassword();