// index.js
const app = require('./app'); // 引入 app 实例
const port = 3001;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});