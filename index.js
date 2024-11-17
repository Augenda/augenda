const express = require('express');
const mysql = require('mysql2/promise'); // Usando promises
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Adicionado

const SECRET_KEY = "your_secret_key"; // Chave secreta para JWT

// Configuração do banco de dados MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'adm',
    password: '123456789',
    database: 'augenda',
});

// Rota para cadastrar um novo usuário
app.post('/api/register', async (req, res) => {
    const { name, username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO user (name, username, password, role) VALUES (?, ?, ?, ?)';
        await db.query(sql, [name, username, hashedPassword, role]);
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
    }
});

// Rota para autenticação de login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
    const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido!', token });
        } else {
    res.status(401).json({ error: 'Senha incorreta' });
    }
    } catch (err) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
