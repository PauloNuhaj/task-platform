const jwt = require('jsonwebtoken');
const User = require('../models/User');


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Ky email ekziston tashmë' });

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, 
      token: generateToken(user._id),
    });
  
  } else {
    res.status(400).json({ message: 'Regjistrimi dështoi' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, 
      token: generateToken(user._id),
    });
  
  } else {
    res.status(401).json({ message: 'Email ose fjalëkalim i gabuar' });
  }
};



const getMe = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};