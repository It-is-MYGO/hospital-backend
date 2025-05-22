const express = require('express');
const cors = require('cors'); // 引入 cors
const app = express();
const port = 3001;

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor'); // 引入 doctor 路由
const appointmentRoutes = require('./routes/appointment'); // 引入 appointment 路由

// 配置 CORS 中间件，允许所有域名访问
app.use(cors());

// 或者，配置 CORS 中间件，只允许特定域名访问
// app.use(cors({
//   origin: 'http://localhost:3000' // 你的前端域名
// }));

app.use(express.json()); // 解析 JSON 请求体

// 使用 authRoutes 处理 /api/auth 路径下的请求
app.use('/api/auth', authRoutes);

// 使用 doctorRoutes 处理 /api/doctors 路径下的请求
app.use('/api/doctors', doctorRoutes);

// 使用 appointmentRoutes 处理 /api/appointments 路径下的请求
app.use('/api/appointments', appointmentRoutes);

// 添加处理根路由 `/` 的路由处理程序
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital API!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});