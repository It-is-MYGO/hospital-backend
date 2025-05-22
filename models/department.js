// models/department.js

const mysql = require('mysql2');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

// 创建科室表 (如果不存在)
async function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `;
  try {
    await pool.promise().query(sql);
    console.log('科室表创建成功');
  } catch (err) {
    console.error('创建科室表失败：', err);
  }
}

createTable();

// 获取科室列表
async function getDepartments() {
  const sql = 'SELECT * FROM departments';
  try {
    const [rows] = await pool.promise().query(sql);
    return rows;
  } catch (err) {
    console.error('获取科室列表失败：', err);
    return null;
  }
}

module.exports = {
  getDepartments
};