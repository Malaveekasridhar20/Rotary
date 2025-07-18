import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  image: String,
  bio: String
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);
