// routes/auth.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

// 注册
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // 验证用户名和密码格式
  if (!username || !password || username.length < 4 || username.length > 16 || password.length < 8) {
    return res.status(400).json({ message: '用户名或密码格式错误' });
  }

  // 检查用户名是否已存在
  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: '用户名已存在' });
  }

  // 创建新用户
  const userId = await userModel.createUser(username, password, email);
  if (!userId) {
    return res.status(500).json({ message: '注册失败' });
  }

  // 返回成功响应
  res.status(201).json({ message: '注册成功', userId: userId });
});

// 登录 (示例，需要完善)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.getUserByUsername(username);

  if (!user) {
    return res.status(401).json({ message: '用户名不存在' });
  }

  // TODO: 验证密码 
  if (user.password !== password) {
    return res.status(401).json({ message: '密码错误' });
  }

  // TODO: 生成 JWT Token (jsonwebtoken)
  const token = 'your_jwt_token'; // 替换为实际生成的 Token

  // 返回用户信息和 Token
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    token: token
  });
});

// 认证状态检查 (示例，需要完善)
router.get('/check', (req, res) => {
  // TODO: 验证 Token (jsonwebtoken)
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: '未认证' });
  }

  // TODO: 验证 Token 的有效性
  const isValidToken = true; // 替换为实际的 Token 验证结果

  if (isValidToken) {
    return res.json({ message: '已认证' });
  } else {
    return res.status(401).json({ message: '认证失败' });
  }
});

module.exports = router;