require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// en donde estan todas las rutas cargadas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('base de datos ONLINE');
})


app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${ process.env.PORT }`);
});