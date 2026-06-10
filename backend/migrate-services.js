import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for migration');

    // Fetch all existing services
    const allServices = await Service.find();

    // Mapping of Subservices -> Main Service
    const categoryMapping = {
      'Baby Shoots': [
        'Newborn Stories',
        'Baby Milestone Story',
        'Tiny Steps',
        'Toddler Memories',
        'Birthday Stories',
        'Growing Stories'
      ]
    };

    for (const [parentName, childNames] of Object.entries(categoryMapping)) {
      const babySubs = [];
      
      // Find these services and delete them from the main list, adding to babySubs
      for (const name of childNames) {
        // Find case insensitive
        const doc = await Service.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
        if (doc) {
          babySubs.push({
            name: doc.name,
            slug: doc.slug,
            description: doc.description,
            imageUrl: doc.imageUrl,
            packages: doc.packages
          });
          await Service.findByIdAndDelete(doc._id);
          console.log(`Deleted flat service: ${doc.name}`);
        }
      }

      if (babySubs.length > 0) {
        // Now check if parent exists
        let parentService = await Service.findOne({ name: { $regex: new RegExp('^' + parentName + '$', 'i') } });
        if (!parentService) {
          parentService = new Service({
            name: parentName,
            slug: parentName.toLowerCase().replace(/ /g, '-'),
            description: `Exclusive ${parentName} sessions.`,
            imageUrl: babySubs[0].imageUrl || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000',
            packages: [],
            subServices: babySubs
          });
          await parentService.save();
          console.log(`Created ${parentName} and added subservices.`);
        } else {
          // Append subservices if not already there
          for (const sub of babySubs) {
            if (!parentService.subServices.find(s => s.slug === sub.slug)) {
              parentService.subServices.push(sub);
            }
          }
          await parentService.save();
          console.log(`Updated ${parentName} with subservices.`);
        }
      }
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMigration();
