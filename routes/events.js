const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// CREATE event
router.post('/', auth, async (req, res) => {
  if (req.user.role !== "organizer")
    return res.status(403).json({ message: "Only organizers can create events" });

  const event = await Event.create({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    organizerId: req.user.id,
  });

  res.status(201).json({ message: "Event created", event });
});

// UPDATE event
router.put('/:id', auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event)
    return res.status(404).json({ message: "Event not found" });

  if (event.organizerId.toString() !== req.user.id)
    return res.status(403).json({ message: "Not your event" });

  Object.assign(event, req.body);
  await event.save();

  res.json({ message: "Event updated", event });
});

// DELETE event
router.delete('/:id', auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event)
    return res.status(404).json({ message: "Event not found" });

  if (event.organizerId.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  await event.remove();
  res.json({ message: "Event deleted" });
});

// REGISTER for event
router.post('/:id/register', auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event)
    return res.status(404).json({ message: "Event not found" });

  if (event.participants.includes(req.user.id))
    return res.status(400).json({ message: "Already registered" });

  event.participants.push(req.user.id);
  await event.save();

  res.json({ message: "Event registration successful", event });
});

module.exports = router;
