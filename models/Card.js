const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
  },
  bizPhone: {
    type: Number,
    required: true,
    unique: true,
    minlength: 1,
  },
  bizImage: {
    type: String,
    required: true,
    minlength: 2,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Card = mongoose.model("card", cardSchema);
module.exports = Card;
