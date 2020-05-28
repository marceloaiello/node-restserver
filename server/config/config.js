//=============
// puerto
//===========
process.env.PORT = process.env.PORT || 3000;

//=============
// entorno
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
// fecha expiracion token
//===========
//expiera en 30 dias: 60 segundos * 60 minutos * 24 horas * 30 dias... 
process.env.CADUCIDAD_TOKEN = '48h';


//=============
// seed de token
//===========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==============
// base de datos
//==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    //urlDB = 'mongodb+srv://cafe-user:e0N5bhHf3B97lEea@cluster0-cwfiy.mongodb.net/cafe'
    urlDB = process.env.MONGO_URI;
};

process.env.URLDB = urlDB;


//==============
// google client id
//==============

process.env.CLIENT_ID = process.env.CLIENT_ID || '202101856453-t518r1uc1k3lbusbmlpvlhgef2ocl6d3.apps.googleusercontent.com';