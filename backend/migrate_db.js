import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// The old database connection string
const OLD_URI = "mongodb+srv://astitvacreations1008_db_user:zO1XiZjVJQnNlzHx@cluster0.i8iok0j.mongodb.net/?appName=Cluster0";
// The new database connection string from your updated .env
const NEW_URI = process.env.MONGODB_URI;

if (!NEW_URI || NEW_URI === OLD_URI) {
  console.error("Please make sure your new MONGODB_URI is correctly set in the .env file and is different from the old one.");
  process.exit(1);
}

async function migrate() {
  console.log("Connecting to old database...");
  const oldDb = await mongoose.createConnection(OLD_URI).asPromise();
  
  console.log("Connecting to new database...");
  const newDb = await mongoose.createConnection(NEW_URI).asPromise();
  
  console.log("Fetching collections...");
  const collections = await oldDb.db.listCollections().toArray();
  
  for (let collectionInfo of collections) {
    const colName = collectionInfo.name;
    console.log(`Migrating collection: ${colName}`);
    
    const oldCollection = oldDb.collection(colName);
    const newCollection = newDb.collection(colName);
    
    const docs = await oldCollection.find({}).toArray();
    
    if (docs.length > 0) {
      // Clear new collection just in case
      await newCollection.deleteMany({});
      await newCollection.insertMany(docs);
      console.log(`✅ Migrated ${docs.length} documents in ${colName}`);
    } else {
      console.log(`⚠️ No documents found in ${colName}`);
    }
  }
  
  console.log("Migration completely finished!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
