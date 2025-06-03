// models/appointment.js

const mysql = require('mysql2');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

// 创建挂号表 (如果不存在)
async function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      user_id INT,
      appointment_time DATETIME,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  try {
    await pool.promise().query(sql);
    console.log('挂号表创建成功');
  } catch (err) {
    console.error('创建挂号表失败：', err);
  }
}

createTable();

// 添加挂号信息
async function addAppointment(doctorId, userId, appointmentTime) {
  const sql = `
    INSERT INTO appointments (doctor_id, user_id, appointment_time)
    VALUES (?, ?, ?)
  `;
  const values = [doctorId, userId, appointmentTime];

  try {
    const [result] = await pool.promise().query(sql, values);
    return result.insertId;
  } catch (err) {
    console.error('添加挂号信息失败：', err);
    return null;
  }
}

module.exports = {
  addAppointment
};