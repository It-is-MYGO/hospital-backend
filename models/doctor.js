// models/doctor.js

const mysql = require('mysql2');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

// 创建医生表 (如果不存在)
async function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      specialty VARCHAR(255),
      department_id INT,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )
  `;
  try {
    await pool.promise().query(sql);
    console.log('医生表创建成功');
  } catch (err) {
    console.error('创建医生表失败：', err);
  }
}

createTable();

// 获取医生列表
async function getDoctors(department) {
  let sql = 'SELECT * FROM doctors';
  const values = [];

  if (department) {
    sql += ' WHERE department_id = (SELECT id FROM departments WHERE name = ?)';
    values.push(department);
  }

  try {
    const [rows] = await pool.promise().query(sql, values);
    return rows;
  } catch (err) {
    console.error('获取医生列表失败：', err);
    return null;
  }
}

// 添加医生
async function addDoctor(name, title, specialty, departmentId) {
  const sql = `
    INSERT INTO doctors (name, title, specialty, department_id)
    VALUES (?, ?, ?, ?)
  `;
  const values = [name, title, specialty, departmentId];

  try {
    const [result] = await pool.promise().query(sql, values);
    return result.insertId;
  } catch (err) {
    console.error('添加医生失败：', err);
    return null;
  }
}

module.exports = {
  getDoctors,
  addDoctor
};