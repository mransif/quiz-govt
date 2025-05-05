import { MongoClient } from 'mongodb';

// Connection URI from environment variable
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'quiz_app';
const collectionName = 'participants';

// Cache the database connection
let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable'
    );
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Get all participants
export async function getAllParticipants() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    const participants = await collection.find({}).toArray();
    return participants;
  } catch (error) {
    console.error('Error getting participants:', error);
    return [];
  }
}

// Add a new participant
export async function addParticipant(participant) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    
    // Check if participant with same phone number already exists
    const existingParticipant = await collection.findOne({ phone: participant.phone });
    
    if (existingParticipant) {
      // Update existing participant's score if new score is higher
      if (participant.score > existingParticipant.score) {
        await collection.updateOne(
          { phone: participant.phone },
          { $set: participant }
        );
      }
    } else {
      // Add new participant
      await collection.insertOne(participant);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding participant:', error);
    return { success: false, error: error.message };
  }
}

// Get leaderboard (sorted by score)
export async function getLeaderboard() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    
    // Get participants sorted by score (descending)
    const leaderboard = await collection
      .find({})
      .sort({ score: -1 })
      .toArray();
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}