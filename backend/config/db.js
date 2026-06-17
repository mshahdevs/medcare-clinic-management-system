import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        'Missing MongoDB connection string in environment variables',
      );
    }
    console.log('Mongo URI loaded:', process.env.MONGODB_URI ? 'YES' : 'NO');
    console.log(
      'Mongo URI host:',
      process.env.MONGODB_URI?.split('@')[1]?.split('/')[0],
    );
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
