const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(
      expenses.map((e) => ({
        id: e._id.toString(), 
        title: e.title,
        amount: e.amount,
        date: e.date,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new expense
router.post("/", async (req, res) => {
  const { title, amount, date } = req.body;
  const expense = new Expense({ title, amount, date });
  try {
    const savedExpense = await expense.save();
    res.status(201).json({
      id: savedExpense._id.toString(),
      title: savedExpense.title,
      amount: savedExpense.amount,
      date: savedExpense.date,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update expense
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      id: updatedExpense._id.toString(),
      title: updatedExpense.title,
      amount: updatedExpense.amount,
      date: updatedExpense.date,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// DELETE an expense
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
