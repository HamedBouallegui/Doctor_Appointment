const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
// Connect to MongoDB
const connectDB = async () => {
  try {
    // This will create the database if it doesn't exist
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Create collections
const createCollections = async () => {
  try {
    // Get the database instance
    const db = mongoose.connection.db;
    
    // Get list of existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Create users collection if it doesn't exist
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Users collection created');
    } else {
      console.log('Users collection already exists');
    }
    
    // Create appointments collection if it doesn't exist
    if (!collectionNames.includes('appointments')) {
      await db.createCollection('appointments');
      console.log('Appointments collection created');
    } else {
      console.log('Appointments collection already exists');
    }
    
    // Create indexes for better performance
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('Index created on users.email');
    
    const appointmentsCollection = db.collection('appointments');
    await appointmentsCollection.createIndex({ user: 1 });
    await appointmentsCollection.createIndex({ date: 1 });
    console.log('Indexes created on appointments.user and appointments.date');
    
    return true;
  } catch (err) {
    console.error('Error creating collections:', err.message);
    return false;
  }
};

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    // Import User model
    const User = require('../models/User');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      // Import bcrypt for password hashing
      const bcrypt = require('bcryptjs');
      
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    return true;
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    return false;
  }
};

// Main function to initialize database
const initializeDatabase = async () => {
  // Connect to MongoDB
  const connected = await connectDB();
  if (!connected) {
    console.error('Failed to connect to MongoDB. Database initialization aborted.');
    process.exit(1);
  }
  
  // Create collections and indexes
  const collectionsCreated = await createCollections();
  if (!collectionsCreated) {
    console.error('Failed to create collections. Database initialization aborted.');
    process.exit(1);
  }
  
  // Create admin user
  const adminCreated = await createAdminUser();
  if (!adminCreated) {
    console.error('Failed to create admin user. Database initialization aborted.');
    process.exit(1);
  }
  
  console.log('Database initialization completed successfully!');
  process.exit(0);
};

// Run the initialization
initializeDatabase();