const Task = require('../models/Task');

// @desc Merr të gjitha detyrat e përdoruesit
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

// @desc Krijo një detyrë të re
// @route POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Titulli është i detyrueshëm' });

  const task = await Task.create({
    user: req.user.id,
    title,
    description,
  });

  res.status(201).json(task);
};

// @desc Përditëso një detyrë
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Detyra nuk u gjet' });

  if (task.user.toString() !== req.user.id)
    return res.status(403).json({ message: 'Nuk jeni i autorizuar' });

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

// @desc Fshi një detyrë
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Detyra nuk u gjet' });

  if (task.user.toString() !== req.user.id)
    return res.status(403).json({ message: 'Nuk jeni i autorizuar' });

  await task.deleteOne();
  res.status(200).json({ message: 'Detyra u fshi me sukses' });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};