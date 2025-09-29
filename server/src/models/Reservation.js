import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  spot: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
