const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const joi = require("joi");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");

const cardSchema = joi.object({
  bizName: joi.string().required().min(2),
  bizDescription: joi.string().required().min(2).max(255),
  bizAddress: joi.string().required().min(2).max(255),
  bizPhone: joi.string().required().min(8),
  bizImage: joi.string().required().min(2),
});

// delete card
router.delete("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findByIdAndRemove(req.params.id);
    if (!card) return res.status(404).send("no such card");
    res.status(200).send("card removed Succesfully ");
  } catch (error) {
    res.status(400).send("Error in Card " + error);
  }
});

// create new card
router.post("/", auth, async (req, res) => {
  try {
    // validation joi
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    // add new card to db
    let card = new Card(req.body);

    //create new bizNumber and check to see if biz number exist
    let bizNumberFlag = true;
    let newBizNumber;
    do {
      newBizNumber = _.random(1, 100000);
      let checkCard = await Card.find({ bizNumber: newBizNumber });
      if (!checkCard) bizNumberFlag = false;
    } while (bizNumberFlag);
    card.bizNumber = newBizNumber;
    card.userId = req.payload._id;
    // save card
    await card.save();
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("error in card " + error);
  }
});

// find all cards for userid
router.get("/myCards", auth, async (req, res) => {
  try {
    let cards = await Card.find({ userId: req.payload._id });
  } catch (error) {
    res.status(400).send("Error in Card" + error);
  }
});

// find all cards
router.get("/", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("Error in card" + error);
  }
});

module.exports = router;
