const User = require('../models/User');

// @desc Merr listën e userave (vetëm për manager)
const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Vetëm manager mund të shohë userat' });
    }

    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së userave' });
  }
};

module.exports = {
  getUsers,
};