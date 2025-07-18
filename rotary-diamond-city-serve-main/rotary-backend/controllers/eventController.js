import Event from '../models/Event.js';
import { broadcast } from '../index.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    broadcast({ type: 'EVENT_CREATED', data: event });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    broadcast({ type: 'EVENT_UPDATED', data: event });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    broadcast({ type: 'EVENT_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
