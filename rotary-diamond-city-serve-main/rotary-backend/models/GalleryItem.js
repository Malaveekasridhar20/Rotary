import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  title: String,
  image: { type: String, required: true },
  description: String
}, { timestamps: true });

export default mongoose.model('GalleryItem', galleryItemSchema);
