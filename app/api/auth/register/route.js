import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI)

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await client.connect()
    const db = client.db('AskUp_Virtual_Interview')
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      provider: 'credentials',
      created_at: new Date(),
      updated_at: new Date()
    })

    return Response.json({ 
      message: 'User created successfully',
      userId: result.insertedId 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}