const Ticket = require('../models/Ticket');

// @route POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/tickets
// Regular users see only their own tickets; agents/admins see all (with optional filters)
const getTickets = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    const filter = {};

    if (req.user.role === 'user') {
      filter.createdBy = req.user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/tickets/:id
const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.author', 'name role');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Regular users can only view their own tickets
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/tickets/:id
// Users can edit their own open tickets (title/description); agents/admins can update status/assignment
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'agent' || req.user.role === 'admin';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, category, priority, status, assignedTo } = req.body;

    if (isOwner && !isStaff) {
      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (category) ticket.category = category;
    }

    if (isStaff) {
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;
      if (title) ticket.title = title;
      if (description) ticket.description = description;
      if (category) ticket.category = category;
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/tickets/:id
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/tickets/:id/comments
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'agent' || req.user.role === 'admin';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    ticket.comments.push({ text, author: req.user._id });
    await ticket.save();

    const updated = await Ticket.findById(ticket._id).populate('comments.author', 'name role');
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/tickets/stats/summary
// Dashboard stats: counts by status, category, priority
const getStats = async (req, res) => {
  try {
    const filter = req.user.role === 'user' ? { createdBy: req.user._id } : {};

    const [statusCounts, categoryCounts, priorityCounts, total] = await Promise.all([
      Ticket.aggregate([{ $match: filter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: filter }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $match: filter }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Ticket.countDocuments(filter),
    ]);

    res.json({ total, statusCounts, categoryCounts, priorityCounts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getStats,
};
