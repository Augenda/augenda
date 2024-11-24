const express = require('express');
const mysql = require('mysql2/promise'); // Usando promises
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

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

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do multer para salvar arquivos localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Diretório onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Rota para adicionar funcionário
app.post("/api/add-worker", upload.single("photo"), (req, res) => {
    const { name, username, password, role } = req.body;
    const photoPath = req.file ? req.file.path : null; // Caminho da imagem salva

    // Criptografar a senha antes de salvar no banco
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criptografar a senha" });
        }

        const sql = "INSERT INTO User (name, username, password, role, profile_image) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [name, username, hashedPassword, role, photoPath], (err, result) => {
            if (err) {
                console.error("Erro ao salvar no banco:", err);
                return res.status(500).json({ error: "Erro ao adicionar funcionário" });
            }
            res.status(200).json({ message: "Funcionário adicionado com sucesso!" });
        });
    });
});

// Endpoint para adicionar um pet
app.post("/api/add-pet", upload.single("photo"), async (req, res) => {
    try {
        const { name, breed, age, idclient, type } = req.body;
        const photoPath = req.file ? req.file.filename : null; // Caminho do arquivo

        // Insere os dados no banco de dados
        const query = `
            INSERT INTO pet (name, breed, age, id_client, type, pet_photo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [name, breed, age, idclient, type, photoPath];
        await db.query(query, values);

        res.status(201).json({ message: "Pet cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar o pet:", error);
        res.status(500).json({ error: "Erro ao cadastrar o pet." });
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
            let profileImage = null;
            // Verifica se a imagem do perfil existe como BLOB
            if (user.profile_image) {
                // Converte o BLOB para Base64 (assumindo que o BLOB é uma imagem JPEG)
                profileImage = `data:image/jpeg;base64,${user.profile_image.toString('base64')}`;
            }

            const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Login bem-sucedido!',
                token,
                name: user.name,
                profileImage: profileImage, // Envia a imagem em Base64
            });
        } else {
            res.status(401).json({ error: 'Senha incorreta' });
        }
    } catch (err) {
        console.error("Erro no servidor:", err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
