// Función para establecer una cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Función para obtener el valor de una cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


// Simulación de una base de datos en el lado del cliente
var compras = [];

// Función para registrar una compra en la "base de datos"
function registrarCompra(usuario) {
    compras.push(usuario);
}

// Función para obtener el número de compras
function obtenerNumeroDeCompras() {
    return compras.length;
}


// Cuando se realiza una compra, establece una cookie y registra la compra
function compraRealizada(usuario) {
    setCookie("compra_realizada", "true", 30); // Establece una cookie que expira en 30 días
    registrarCompra(usuario);
}


// Importar las bibliotecas necesarias
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Configurar Express
const app = express();
app.use(bodyParser.json());

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/tienda', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => console.log('Conexión exitosa a MongoDB'));

// Definir un esquema para los datos de compra
const compraSchema = new mongoose.Schema({
    usuario: String,
    fecha: { type: Date, default: Date.now }
});
const Compra = mongoose.model('Compra', compraSchema);

// Ruta para manejar la compra
app.post('/comprar', (req, res) => {
    const { usuario } = req.body;

    // Guardar la compra en la base de datos
    const nuevaCompra = new Compra({ usuario });
    nuevaCompra.save((err, compra) => {
        if (err) {
            console.error('Error al guardar la compra:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.status(200).send('Compra realizada con éxito');
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
