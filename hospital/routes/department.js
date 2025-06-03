// routes/department.js

const express = require('express');
const router = express.Router();
const departmentModel = require('../models/department');

// 获取科室列表
router.get('/', async (req, res) => {
    try {
        const departments = await departmentModel.getDepartments();
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '获取科室列表失败', error: err.message }); // 添加错误信息
    }
});

// 添加科室
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const departmentId = await departmentModel.addDepartment(name);

        if (!departmentId) {
            return res.status(500).json({ message: '添加科室失败' });
        }

        res.status(201).json({ message: '添加科室成功', departmentId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '添加科室失败', error: err.message }); // 添加错误信息
    }
});

module.exports = router;