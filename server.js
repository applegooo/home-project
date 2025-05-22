const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const PORT = 8081;

// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3308,
  password: '123456',
  database: 'login_example',
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL 연결 성공!');
});

// 미들웨어
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(sql, [username, password, email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send('❌ 이미 존재하는 아이디입니다.');
      }
      return res.send('DB 오류: ' + err.message);
    }
    res.send(`<script>alert("회원가입 성공!"); location.href="/";</script>`);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.send('DB 오류: ' + err.message);
    if (results.length === 0) {
      return res.send('❌ 아이디 또는 비밀번호가 틀렸습니다.');
    }
    res.send(
      `<script>alert("로그인 성공! ${results[0].username}님 환영합니다.");</script>`
    );
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/main.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
