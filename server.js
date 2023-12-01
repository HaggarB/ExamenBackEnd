const express = require('express');//implementacion de Express.js
const mysql = require('mysql2'); //conexion a MySQL (el normal no me funcionó)
const jwt = require('jsonwebtoken'); //implementacion para el JWT

const app = express(); //Inicializa Express.js

//Conexion a mi base de datos de prueba, con usuario y contraseñas sencillas para facil acceso
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbprueba',
});

const secretKey = 'dummyClave'; //Clave de prueba para JWT

const generateToken = (usuario) => {
    return jwt.sign({ usuario }, secretKey, { expiresIn: '1m' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

app.use(express.json()); //Habilita los JSON para Express.js

// Rutas de prueba sin conexion a la base de datos
app.get('/', (req, res) => {
    res.send('¡Hola! Esta es la página de inicio.');
});

app.get('/about', (req, res) => {
    res.send('Bienvenido a la página \'Acerca de nosotros\'.');
});

app.get('/contact', (req, res) => {
    res.send('Ponte en contacto con nosotros en contact@example.com.');
});

// Rutas para utilizar procedimientos almacenados
//POST para Altas
app.post('/AltaUsuarios', authenticateToken, (req, res) => {
    connection.query('CALL AltaUsuarios(?, ?)', [req.body.u_nombre, req.body.u_email], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar AltaUsuarios:', error);
            res.status(500).json({ error: 'Error al ejecutar AltaUsuarios' });
        } else {
            res.json({ message: 'Stored procedure AltaUsuarios ejecutado correctamente' });
        }
    });
});

app.post('/AltaAutores', authenticateToken, (req, res) => {
    connection.query('CALL AltaAutores(?, ?)', [req.body.a_nombre, req.body.a_apellido], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar AltaAutores:', error);
            res.status(500).json({ error: 'Error al ejecutar AltaAutores' });
        } else {
            res.json({ message: 'Stored procedure AltaAutores ejecutado correctamente' });
        }
    });
});

app.post('/AltaLibros', authenticateToken, (req, res) => {
    connection.query('CALL AltaLibros(?, ?)', [req.body.l_nombre, req.body.l_autor_id], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar AltaLibros:', error);
            res.status(500).json({ error: 'Error al ejecutar AltaLibros' });
        } else {
            res.json({ message: 'Stored procedure AltaLibros ejecutado correctamente' });
        }
    });
});

//DELETE para Bajas
app.delete('/BajaUsuarios/:usuario_id', authenticateToken, (req, res) => {
    const usuarioId = req.params.usuario_id;
    connection.query('CALL BajaUsuarios(?)', [usuarioId], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar BajaUsuarios:', error);
            res.status(500).json({ error: 'Error al ejecutar BajaUsuarios' });
        } else {
            res.json({ message: 'Stored procedure BajaUsuarios ejecutado correctamente' });
        }
    });
});

app.delete('/BajaAutores/:autor_id', authenticateToken, (req, res) => {
    const autorId = req.params.autor_id;
    connection.query('CALL BajaAutores(?)', [autorId], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar BajaAutores:', error);
            res.status(500).json({ error: 'Error al ejecutar BajaAutores' });
        } else {
            res.json({ message: 'Stored procedure BajaAutores ejecutado correctamente' });
        }
    });
});

app.delete('/BajaLibros/:libro_id', authenticateToken, (req, res) => {
    const libroId = req.params.libro_id;
    connection.query('CALL BajaLibros(?)', [libroId], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar BajaLibros:', error);
            res.status(500).json({ error: 'Error al ejecutar BajaLibros' });
        } else {
            res.json({ message: 'Stored procedure BajaLibros ejecutado correctamente' });
        }
    });
});

//GET para Consultas
app.get('/ConsultaUsuarios', authenticateToken, (req, res) => {
    connection.query('CALL ConsultaUsuarios()', (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar ConsultaUsuarios:', error);
            res.status(500).json({ error: 'Error al ejecutar ConsultaUsuarios' });
        } else {
            res.json({ usuarios: results[0] });
        }
    });
});

app.get('/ConsultaAutores', authenticateToken, (req, res) => {
    connection.query('CALL ConsultaAutores()', (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar ConsultaAutores:', error);
            res.status(500).json({ error: 'Error al ejecutar ConsultaAutores' });
        } else {
            res.json({ autores: results[0] });
        }
    });
});

app.get('/ConsultaLibros', authenticateToken, (req, res) => {
    connection.query('CALL ConsultaLibros()', (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar ConsultaLibros:', error);
            res.status(500).json({ error: 'Error al ejecutar ConsultaLibros' });
        } else {
            res.json({ libros: results[0] });
        }
    });
});

app.get('/ConsultaLibrosPorAutor/:l_autor_id', authenticateToken, (req, res) => {
    const autorId = req.params.l_autor_id;
    connection.query('CALL ConsultaLibrosPorAutor(?)', [autorId], (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar ConsultaLibrosPorAutor:', error);
            res.status(500).json({ error: 'Error al ejecutar ConsultaLibrosPorAutor' });
        } else {
            res.json({ libros: results[0] });
        }
    });
});

app.get('/ConsultaAutoresYLibros', authenticateToken, (req, res) => {
    connection.query('CALL ConsultaAutoresYLibros()', (error, results, fields) => {
        if (error) {
            console.error('Error al ejecutar ConsultaAutoresYLibros:', error);
            res.status(500).json({ error: 'Error al ejecutar ConsultaAutoresYLibros' });
        } else {
            res.json({ autoresConLibros: results[0] });
        }
    });
});

// Función para verificar el token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado. Acceso no autorizado' });
    }

    // Verificar token
    const decodedToken = verifyToken(token);

    if (decodedToken) {
        req.user = decodedToken.usuario;
        next();
    } else {
        res.status(401).json({ error: 'Token no valido o expirado. Acceso no autorizado.' });
    }
}



// Login en POST para generar Token
app.post('/login', (req, res) => {
    const { dummyUser, dummyPass } = req.body;

    if (dummyUser === 'abcd' && dummyPass === '1234') {
        // Generar token
        const token = generateToken(dummyUser);

        res.status(200).json({ token });
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

app.post('/protected', (req, res) => {
    const token = req.headers.authorization;

    // Verificar token
    const decodedToken = verifyToken(token);

    if (decodedToken) {
        res.status(200).send('Token valido. Acceso permitido.');
    } else {
        res.status(401).send('Token no valido o expirado. Acceso no autorizado.');
    }
});

//Conexion a localhost en el puerto 4053
const puerto = 4053;

app.listen(puerto, () => {
    console.log(`Aplicacion corriendo en el puerto ${puerto}`)
  })

//Cierra la conexion al finalizar, por seguridad para que no quede corriendo
app.on('close', () => {
    connection.end();
});
