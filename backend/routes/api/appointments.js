const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Appointment = require('../../models/Appointment');
const User = require('../../models/User');

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // If admin, get all appointments
    if (req.user.role === 'admin') {
      const appointments = await Appointment.find().sort({ date: -1 });
      return res.json(appointments);
    }
    
    // If regular user, get only their appointments
    const appointments = await Appointment.find({ user: req.user.id }).sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
  const { patientName, service, date, time, notes } = req.body;

  try {
    const newAppointment = new Appointment({
      user: req.user.id,
      patientName,
      service,
      date,
      time,
      notes
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { patientName, service, date, time, status, notes } = req.body;

  // Build appointment object
  const appointmentFields = {};
  if (patientName) appointmentFields.patientName = patientName;
  if (service) appointmentFields.service = service;
  if (date) appointmentFields.date = date;
  if (time) appointmentFields.time = time;
  if (status) appointmentFields.status = status;
  if (notes) appointmentFields.notes = notes;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    // Make sure user owns appointment or is admin
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: appointmentFields },
      { new: true }
    );

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    // Make sure user owns appointment or is admin
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Appointment.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;