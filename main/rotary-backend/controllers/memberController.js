import Member from '../models/Member.js';
import { broadcast } from '../index.js';

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    broadcast({ type: 'MEMBER_CREATED', data: member });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    broadcast({ type: 'MEMBER_UPDATED', data: member });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    broadcast({ type: 'MEMBER_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
