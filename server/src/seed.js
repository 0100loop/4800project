import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Spot from './models/Spot.js';
import Reservation from './models/Reservation.js';

const DB_NAME = '4800project';
const MONGO_URI = process.env.MONGO_URI?.trim() || 'mongodb://127.0.0.1:27017/4800project';
console.log('Connecting to:', MONGO_URI);

async function run() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log('Connected to Mongo');

  await Reservation.deleteMany({});
  await Spot.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({ name: 'Demo User', email: 'demo@example.com', passwordHash: 'hashed', role: 'user' });
  const spot = await Spot.create({
    title: 'Cozy Cabin', description: 'A quiet cabin in the woods',
    location: { city: 'Somewhere', state: 'CA', country: 'USA', lat: 37.77, lng: -122.42 },
    images: [], pricePerNight: 120, amenities: ['wifi', 'kitchen'], host: user._id
  });
  await Reservation.create({
    spot: spot._id, guest: user._id,
    checkIn: new Date(Date.now()+86400000), checkOut: new Date(Date.now()+2*86400000),
    totalPrice: 120, status: 'confirmed'
  });

  console.log('Seeded Users, Spots, Reservations');
  await mongoose.disconnect();
  console.log('Disconnected');
}
run().catch(async (e) => { console.error('Seed failed:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
