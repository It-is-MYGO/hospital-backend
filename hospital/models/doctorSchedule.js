// models/doctorSchedule.js
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 创建医生排班表 (如果不存在)
async function createTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS doctor_schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                doctor_id INT,
                start_time DATETIME,
                end_time DATETIME,
                appointment_price DECIMAL(10, 2),
                FOREIGN KEY (doctor_id) REFERENCES doctors(id)
            )
        `;
        await pool.query(sql);
        console.log('医生排班表创建成功');
    } catch (err) {
        console.error('创建医生排班表失败：', err);
        throw err; // 抛出错误
    }
}

// 获取医生排班列表
async function getDoctorSchedules(doctorId) {
    const sql = `
        SELECT *
        FROM doctor_schedules
        WHERE doctor_id = ?
    `;
    const values = [doctorId];

    try {
        const [rows] = await pool.query(sql, values);
        return rows;
    } catch (err) {
        console.error('获取医生排班列表失败：', err);
        throw err; // 抛出错误
    }
}

// 添加医生排班
async function addDoctorSchedule(doctorId, startTime, endTime, appointmentPrice) {
    const sql = `
        INSERT INTO doctor_schedules (doctor_id, start_time, end_time, appointment_price)
        VALUES (?, ?, ?, ?)
    `;
    const values = [doctorId, startTime, endTime, appointmentPrice];

    try {
        const [result] = await pool.query(sql, values);
        return result.insertId;
    } catch (err) {
        console.error('添加医生排班失败：', err);
        throw err; // 抛出错误
    }
}

// 根据 ID 获取医生排班信息
async function getDoctorScheduleById(id) {
    const sql = `
        SELECT *
        FROM doctor_schedules
        WHERE id = ?
    `;
    const values = [id];

    try {
        const [rows] = await pool.query(sql, values);
        return rows[0];
    } catch (err) {
        console.error('获取医生排班信息失败：', err);
        throw err; // 抛出错误
    }
}

module.exports = {
    createTable,
    getDoctorSchedules,
    addDoctorSchedule,
    getDoctorScheduleById
};

// 在应用启动时创建医生排班表
createTable();