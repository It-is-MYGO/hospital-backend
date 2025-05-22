// routes/appointment.js

const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointment');

// 添加挂号信息
router.post('/', async (req, res) => {
  const { doctorId, userId, appointmentTime } = req.body;

  try {
    const appointmentId = await appointmentModel.addAppointment(doctorId, userId, appointmentTime);
    if (!appointmentId) {
      return res.status(500).json({ message: '添加挂号信息失败' });
    }

    res.status(201).json({ message: '添加挂号信息成功', appointmentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '添加挂号信息失败' });
  }
});

module.exports = router;