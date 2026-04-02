const Habit = require('../models/Habit');

const createHabit = async (req, res) => {
  try {
    const { title, description, category, frequency, startDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      description,
      category,
      frequency,
      startDate,
    });

    return res.status(201).json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(habits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    return res.status(200).json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { title, description, category, frequency, startDate } = req.body;

    habit.title = title || habit.title;
    habit.description = description ?? habit.description;
    habit.category = category || habit.category;
    habit.frequency = frequency || habit.frequency;
    habit.startDate = startDate || habit.startDate;

    const updatedHabit = await habit.save();

    return res.status(200).json(updatedHabit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await habit.deleteOne();

    return res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markHabitComplete = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const date = req.body.date || new Date().toISOString().split('T')[0];

    const alreadyCompleted = habit.completionHistory.find((item) => item.date === date);

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Habit already completed for this date' });
    }

    habit.completionHistory.push({
      date,
      completedAt: new Date(),
    });

    const updatedHabit = await habit.save();

    return res.status(200).json({
      message: 'Habit marked as complete',
      habit: updatedHabit,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHabit,
  getMyHabits,
  getMyHabitById,
  updateHabit,
  deleteHabit,
  markHabitComplete,
};