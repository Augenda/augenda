const express = require('express');
const mysql = require('mysql2/promise'); // Usando promises
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Permitir o frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Adicionado

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const SECRET_KEY = "your_secret_key"; // Chave secreta para JWT

// Configuração do banco de dados MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'adm',
    password: '123456789',
    database: 'augenda',
});

// Configura a pasta 'uploads' como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do multer para salvar arquivos localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Diretório onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; // Nome único com timestamp
        cb(null, fileName); // Define o nome do arquivo gerado
      }
});

const upload = multer({ storage });

// Rota para adicionar funcionário
app.post("/api/add-worker", upload.single("photo"), (req, res) => {
    const { name, username, password, role } = req.body;
    const photoPath = req.file ? req.file.path : null;  // Caminho correto

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

// Rota para adicionar cliente
app.post("/api/add-customer", upload.single("photo"), async (req, res) => {
    try {
        const {
            name,
            phone,
            cpf,
            birth_date,  // Agora pega a data diretamente
            status,
            adress: address,
            ref,
            city,
            state
        } = req.body;

        const photoPath = req.file ? req.file.filename : null; // Caminho do arquivo

        // Formatar a data para o formato YYYY-MM-DD
        const formattedDate = new Date(birth_date).toISOString().split('T')[0]; // Converte a data para o formato correto

        // Insere os dados no banco de dados
        const query = `
            INSERT INTO client (name, phone, cpf, birth_date, status, address, ref, city, state, client_photo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            name,              // Nome
            phone,             // Telefone
            cpf,               // CPF
            formattedDate,     // Data de nascimento formatada
            status,            // Status
            address,           // Endereço
            ref,               // Referência
            city,              // Cidade
            state,             // Estado
            photoPath          // Caminho da foto
        ];

        // Executa a query
        await db.query(query, values);

        res.status(201).json({ message: "Cliente cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar o cliente:", error);
        res.status(500).json({ error: "Erro ao cadastrar o cliente." });
    }
});

// Rota para adicionar um serviço
app.post("/api/add-service", async (req, res) => {
    try {
        const { description, price, status } = req.body;

        // Insere os dados no banco
        const query = `
            INSERT INTO services (description, price, status)
            VALUES (?, ?, ?)
        `;

        const values = [description, parseFloat(price), status]; // Certifique-se de que `price` é numérico
        await db.query(query, values);

        res.status(201).json({ message: "Serviço criado com sucesso!" });
    } catch (error) {
        console.error("Erro ao adicionar o serviço:", error);
        res.status(500).json({ error: "Erro ao adicionar o serviço." });
    }
});

app.post("/api/add-appointment", async (req, res) => {
    try {
        const { employee, service, pet, dt_ini, dt_prev, dt_complete } = req.body;

        const query = `
            INSERT INTO appointment (employee, service, pet, dt_ini, dt_prev, dt_complete)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [employee, service, pet, dt_ini, dt_prev, dt_complete];
        await db.query(query, values);

        res.status(201).json({ message: "Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ error: "Erro ao criar agendamento." });
    }
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
        // Busca o usuário pelo username
        const [results] = await db.query('SELECT * FROM user WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Monta o caminho completo para a imagem de perfil, se existir
            let profileImage = null;
            if (user.profile_image) {
                profileImage = `/uploads/${user.profile_image}`; // Supondo que o campo profile_image contém apenas o nome do arquivo
            }

            // Gera o token JWT
            const token = jwt.sign(
                { user_id: user.user_id, username: user.username, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Retorna os dados do usuário
            res.status(200).json({
                message: 'Login bem-sucedido!',
                token,
                name: user.name,
                profileImage, // Envia o caminho da imagem como URL relativa
            });
        } else {
            res.status(401).json({ error: 'Senha incorreta' });
        }
    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

//ROTAS PARA BUSCAR INFORMAÇÕES!!!!!

app.get("/api/users", async (req, res) => {
    try {
        const query = "SELECT user_id, name FROM user";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        res.status(500).json({ error: "Erro ao buscar funcionários." });
    }
});

app.get("/api/services", async (req, res) => {
    try {
        const query = "SELECT service_id, description FROM services";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        res.status(500).json({ error: "Erro ao buscar serviços." });
    }
});

app.get("/api/pets", async (req, res) => {
    try {
        const query = "SELECT pet_id, name FROM pet";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        res.status(500).json({ error: "Erro ao buscar pets." });
    }
});

app.get("/api/clients", async (req, res) => {
    try {
        const query = "SELECT client_id, name FROM client"; 
        const [rows] = await db.query(query);
        res.status(200).json(rows); // Envia a resposta com os dados encontrados
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: "Erro ao buscar clientes." });
    }
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
