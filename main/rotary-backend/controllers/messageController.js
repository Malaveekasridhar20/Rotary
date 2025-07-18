import Message from '../models/Message.js';
import { broadcast } from '../index.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    broadcast({ type: 'MESSAGE_CREATED', data: message });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    broadcast({ type: 'MESSAGE_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
