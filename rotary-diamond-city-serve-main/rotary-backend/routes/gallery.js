import express from 'express';
import { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', createGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;
