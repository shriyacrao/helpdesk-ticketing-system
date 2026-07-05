const User = require('../models/User');

// @route GET /api/users  (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/users/agents  (admin/agent - used to populate assignee dropdown)
const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: { $in: ['agent', 'admin'] } }).select('name email role');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/users/:id/role  (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getAgents, updateUserRole };
