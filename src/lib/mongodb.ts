import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || '';

async function connectDB() {
  // Check if the connection is already established
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Connect to the database
  await mongoose.connect(uri);
  console.log('DB is connected');
}

export default connectDB;
