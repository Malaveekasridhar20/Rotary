import GalleryItem from '../models/GalleryItem.js';
import { broadcast } from '../index.js';

export const getGallery = async (req, res) => {
  try {
    const items = await GalleryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const item = new GalleryItem(req.body);
    await item.save();
    broadcast({ type: 'GALLERY_CREATED', data: item });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    broadcast({ type: 'GALLERY_UPDATED', data: item });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    broadcast({ type: 'GALLERY_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
