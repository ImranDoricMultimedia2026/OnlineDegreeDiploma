import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using process.env.MONGO_URI or MONGODB_URI.
 */
export const connectMongoDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('ℹ️ No MONGO_URI provided in environment. Running with local persistent data store.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);

    // Extract database name from URI or fallback to OnlineDegreeDiploma
    let targetDbName = 'OnlineDegreeDiploma';
    try {
      const match = mongoUri.match(/\/([^/?]+)(\?|$)/);
      if (match && match[1]) {
        targetDbName = match[1];
      }
    } catch (e) {
      // Fallback to default
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      dbName: targetDbName,
    });

    const activeDbName = mongoose.connection.db?.databaseName || mongoose.connection.name;
    const host = mongoose.connection.host;

    console.log('🍃 Successfully connected to MongoDB Atlas!');
    console.log(`📍 Active MongoDB Atlas DB: "${activeDbName}" | Host: "${host}"`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    console.log('⚠️ Falling back to local data store operation.');
    return false;
  }
};

export const getMongoStatus = () => {
  const state = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'Disconnected',
    1: 'Connected (MongoDB Atlas)',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  return {
    isConnected: state === 1,
    statusText: states[state] || 'Unknown',
    databaseName: mongoose.connection.db?.databaseName || mongoose.connection.name || 'N/A',
    host: mongoose.connection.host || 'N/A',
  };
};

