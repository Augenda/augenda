const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'adm',
    password: '123456789',
    database: 'augenda'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco');
});

// Criptografar a senha e inserir no banco
async function createUser() {
    const senhaCriptografada = await bcrypt.hash("1", 10); // Criptografa a senha "1"
    const sql = 'INSERT INTO User (name, username, password, role) VALUES (?, ?, ?, ?)';
    const values = ["5", "5", senhaCriptografada, "user"]; // Insira valores aqui

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
        } else {
            console.log('Usuário inserido com sucesso!');
        }
        db.end(); // Fecha a conexão após inserir o usuário
    });
}

createUser();
