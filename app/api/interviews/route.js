import clientPromise from '@/services/mongoClient';

export async function POST(request) {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    const db = client.db('AskUp_Virtual_Interview');
    
    console.log('Connected to MongoDB, parsing request...');
    const body = await request.json();
    console.log('Request body:', body);
    
    const interviewData = {
      ...body,
      createdAt: new Date(),
      status: 'generated'
    };
    
    console.log('Inserting data:', interviewData);
    const result = await db.collection('interviews').insertOne(interviewData);
    console.log('Insert result:', result);
    
    return new Response(JSON.stringify({ 
      success: true, 
      id: result.insertedId,
      message: 'Interview saved successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('MongoDB Error:', error);
    return new Response(JSON.stringify({
      success: false, 
      error: error.message || 'Failed to save interview'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}