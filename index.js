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
    const { name, username, password, role, status } = req.body;
    const photoPath = req.file ? req.file.path : null;  // Caminho correto

    // Criptografar a senha antes de salvar no banco
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criptografar a senha" });
        }

        const sql = "INSERT INTO User (name, username, password, role, status, profile_image) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, username, hashedPassword, role, status, photoPath], (err, result) => {
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

// Rota para editar um serviço
app.put("/api/services/:id", (req, res) => {
    const { id } = req.params;
    const { description, price, status } = req.body;
  
    // Validação de entrada
    if (!description || !price || !status) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
  
    const query = `
      UPDATE services 
      SET description = ?, price = ?, status = ? 
      WHERE service_id = ?
    `;
    const values = [description, price, status, id];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Erro ao atualizar serviço:", err);
        return res.status(500).json({ error: "Erro ao atualizar serviço." });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Serviço não encontrado." });
      }
  
      res.json({
        message: "Serviço atualizado com sucesso.",
        service: { id, description, price, status },
      });
    });
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
                profileImage = `http://localhost:5000/uploads/${user.profile_image}`; // Supondo que o campo profile_image contém apenas o nome do arquivo
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
        const query = "SELECT user_id, name, username, role FROM user";
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        res.status(500).json({ error: "Erro ao buscar funcionários." });
    }
});

app.get("/api/clients_photos", async (req, res) => {
    try {
      const query = `
        SELECT 
        client.client_id AS id, 
        client.name AS name,
        client.phone AS phone,
        client.status AS status,
        client.address AS address,   
        CONCAT('http://localhost:5000/uploads/', client.client_photo) AS photo
    FROM client
      `;
  
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar pets com informações do dono:", error);
      res.status(500).json({ error: "Erro ao buscar pets." });
    }
  });

app.get("/api/users_photos", async (req, res) => {
    try {
      const query = `
        SELECT 
        user.user_id AS id, 
        user.name AS name,
        user.username AS username,
        user.status AS status, 
        CONCAT('http://localhost:5000/uploads/', user.profile_image) AS photo
    FROM user
      `;
  
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar pets com informações do dono:", error);
      res.status(500).json({ error: "Erro ao buscar pets." });
    }
  });

app.get("/api/services", async (req, res) => {
    try {
        const query = "SELECT service_id, description, price, status FROM services";
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

app.get("/api/pets_photos", async (req, res) => {
    try {
      const query = `
        SELECT 
        pet.pet_id AS id, 
        pet.name AS name, 
        pet.breed AS breed, 
        pet.age AS age, 
        pet.id_client AS idclient, 
        pet.type AS type, 
        CONCAT('http://localhost:5000/uploads/', pet.pet_photo) AS photo,
        client.name AS ownerName
    FROM pet
    LEFT JOIN client ON pet.id_client = client.client_id
      `;
  
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar pets com informações do dono:", error);
      res.status(500).json({ error: "Erro ao buscar pets." });
    }
  });

  app.get("/pets/count", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) AS count FROM pet");
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao contar pets:", error);
        res.status(500).json({ error: "Erro ao contar pets." });
    }
});

app.get("/appointments/count", async (req, res) => {
    const { status } = req.query; // Pode ser "pending" ou "completed"
    try {
        const query = `
            SELECT COUNT(*) AS count 
            FROM appointment 
            WHERE status = ?
        `;
        const [rows] = await db.query(query, [status]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao contar agendamentos:", error);
        res.status(500).json({ error: "Erro ao contar agendamentos." });
    }
});

app.get("/employees/top", async (req, res) => {
    try {
        const query = `
            SELECT a.employee AS name, COUNT(*) AS count
            FROM appointment a
            GROUP BY a.employee
            ORDER BY count DESC
            LIMIT 5
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        res.status(500).json({ error: "Erro ao buscar funcionários." });
    }
});

app.get("/pets/top", async (req, res) => {
    try {
        const query = `
            SELECT a.pet, COUNT(a.pet) AS count
            FROM appointment a
            GROUP BY a.pet
            ORDER BY count DESC
            LIMIT 5;
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar pets:", error);
        res.status(500).json({ error: "Erro ao buscar pets." });
    }
});


app.get("/api/clients", async (req, res) => {
    try {
        const query = "SELECT client_id, name, phone, status, address, client_photo FROM client"; 
        const [rows] = await db.query(query);
        res.status(200).json(rows); // Envia a resposta com os dados encontrados
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: "Erro ao buscar clientes." });
    }
});

app.get("/api/appointments", async (req, res) => {
    const { status } = req.query; // Pega o status enviado na query string
  
    let query = "SELECT * FROM appointment"; // Consulta base
    let queryParams = [];
  
    // Filtra por status
    if (status === "open") {
      query += " WHERE status = 'pending'"; // Agendamentos em aberto
    } else if (status === "completed") {
      query += " WHERE status = 'completed'"; // Agendamentos concluídos
    }
  
    try {
      const [result] = await db.query(query, queryParams); // Aqui foi corrigido para usar 'db'
      console.log(result);  // Adiciona log para inspecionar o resultado
  
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Nenhum agendamento encontrado." });
      }
  
      return res.json(result); // Retorna os agendamentos encontrados
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      return res.status(500).json({ message: "Erro ao carregar agendamentos." });
    }
});

app.put("/api/appointments/:appointmentId/complete", async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Atualiza o status do agendamento para "completed"
        const query = `UPDATE appointment SET status = 'completed', dt_complete = NOW() WHERE appointment_id = ? AND status = 'pending'`;
        const [result] = await db.query(query, [appointmentId]);

        // Verifica se algum agendamento foi atualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Agendamento não encontrado ou já concluído." });
        }

        res.status(200).json({ message: "Agendamento concluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar agendamento:", error);
        res.status(500).json({ error: "Erro ao concluir agendamento." });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
