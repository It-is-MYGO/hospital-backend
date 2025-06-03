//routes/doctor.js
const express = require('express');
const router = express.Router();
const doctorModel = require('../models/doctor');
const departmentModel = require('../models/department');

// 获取医生列表
router.get('/', async (req, res) => {
    const { department } = req.query;

    try {
        const doctors = await doctorModel.getDoctors(department);

        if (!doctors) {
            return res.status(500).json({ message: '获取医生列表失败' });
        }

        res.json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '获取医生列表失败' });
    }
});

// 添加医生功能
router.post('/', async (req, res) => {
    const { name, title, specialty, department } = req.body;

    try {
        // 验证科室是否存在
        const departmentObj = await departmentModel.getDepartmentByName(department);

        if (!departmentObj) {
            return res.status(400).json({ message: '科室不存在' });
        }

        const departmentId = departmentObj.id;

        // 添加医生
        const doctorId = await doctorModel.addDoctor(name, title, specialty, departmentId);

        if (!doctorId) {
            return res.status(500).json({ message: '添加医生失败' });
        }

        res.status(201).json({ message: '添加医生成功', doctorId }); // 修改状态码为 201
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '添加医生失败' });
    }
});

module.exports = router;