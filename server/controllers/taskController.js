const Task = require('../models/Task');

const getTasks = async (req, res) => {
  let tasks;
  if (req.user.role === 'manager') {
    
    tasks = await Task.find().populate('assignedTo', 'name email');
  } else {
 
    tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
  }

  res.status(200).json(tasks);
};


const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: 'Titulli është i detyrueshëm' });
    if (!assignedTo || !dueDate) return res.status(400).json({ message: 'Duhet të caktoni punonjësin dhe datën' });

    const task = await Task.create({
      user: req.user.id, 
      title,
      description,
      assignedTo,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë krijimit të task' });
  }
};


const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Detyra nuk u gjet' });

    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nuk jeni i autorizuar për të përditësuar këtë task' });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë përditësimit të task' });
  }
};


const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Detyra nuk u gjet' });
  
  if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Nuk keni autorizim për të fshirë këtë task' });
  }
  await task.deleteOne();
  res.status(200).json({ message: 'Detyra u fshi me sukses' });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};