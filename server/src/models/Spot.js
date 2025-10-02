import mongoose from 'mongoose';
const spotSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: {
    address: String, city: String, state: String, country: String,
    lat: Number, lng: Number
  },
  images: [String],
  pricePerNight: { type: Number, required: true, min: 0 },
  amenities: [String],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Spot', spotSchema);

