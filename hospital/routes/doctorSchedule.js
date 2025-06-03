// routes/doctorSchedule.js

const express = require('express');
const router = express.Router();
const doctorScheduleModel = require('../models/doctorSchedule');

// 获取医生排班列表
router.get('/', async (req, res) => {
    try {
        const doctorId = req.query.doctorId; // 从查询参数中获取医生 ID
        const doctorSchedules = await doctorScheduleModel.getDoctorSchedules(doctorId);
        res.json(doctorSchedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '获取医生排班列表失败', error: err.message });
    }
});

// 添加医生排班
router.post('/', async (req, res) => {
    const { doctorId, startTime, endTime, appointmentPrice } = req.body;

    try {
        const scheduleId = await doctorScheduleModel.addDoctorSchedule(doctorId, startTime, endTime, appointmentPrice);

        if (!scheduleId) {
            return res.status(500).json({ message: '添加医生排班失败' });
        }

        res.status(201).json({ message: '添加医生排班成功', scheduleId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '添加医生排班失败', error: err.message });
    }
});

// 根据 ID 获取医生排班信息
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const doctorSchedule = await doctorScheduleModel.getDoctorScheduleById(id);

        if (!doctorSchedule) {
            return res.status(404).json({ message: '医生排班信息不存在' });
        }

        res.json(doctorSchedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '获取医生排班信息失败', error: err.message });
    }
});

module.exports = router;