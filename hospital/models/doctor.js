// models/doctor.js
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 创建医生表 (如果不存在)
async function createTable() {
    try {
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
        await pool.query(sql);
        console.log('医生表创建成功');
    } catch (err) {
        console.error('创建医生表失败：', err);
        throw err; // 抛出错误
    }
}

// 获取医生列表
async function getDoctors(departmentName) {
    let sql = `
        SELECT
            d.*,
            GROUP_CONCAT(
                CONCAT_WS(
                    '|',
                    ds.id,
                    ds.start_time,
                    ds.end_time,
                    ds.appointment_price
                )
                ORDER BY ds.start_time
                SEPARATOR ';'
            ) AS schedules
        FROM
            doctors d
        LEFT JOIN
            doctor_schedules ds ON d.id = ds.doctor_id
        LEFT JOIN
            departments dp ON d.department_id = dp.id
        WHERE 1=1
    `;
    const values = [];

    if (departmentName) {
        sql += ' AND dp.name = ?';
        values.push(departmentName);
    }

    sql += `
        GROUP BY
            d.id
    `;

    try {
        const [rows] = await pool.query(sql, values);

        // 处理 schedules 字符串
        const doctors = rows.map(doctor => {
            if (doctor.schedules) {
                doctor.schedules = doctor.schedules.split(';').map(schedule => {
                    const [id, start_time, end_time, appointment_price] = schedule.split('|');
                    return {
                        id: parseInt(id),
                        start_time,
                        end_time,
                        appointment_price: parseFloat(appointment_price)
                    };
                });
            } else {
                doctor.schedules = [];
            }
            return doctor;
        });

        return doctors;
    } catch (err) {
        console.error('获取医生列表失败：', err);
        throw err; // 抛出错误
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
        const [result] = await pool.query(sql, values);
        return result.insertId;
    } catch (err) {
        console.error('添加医生失败：', err);
        throw err; // 抛出错误
    }
}

module.exports = {
    createTable,
    getDoctors,
    addDoctor
};

// 在应用启动时创建医生表
createTable();