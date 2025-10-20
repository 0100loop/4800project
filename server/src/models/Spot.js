import mongoose from 'mongoose';
const SpotSchema = new mongoose.Schema({
  title: String,
  pricePerHour: Number,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  features: {
    bathroom: Boolean,
    evCharging: Boolean,
    shuttle: Boolean,
    tailgateFriendly: Boolean,
    overnightAllowed: Boolean
  },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.model('Spot', SpotSchema);
