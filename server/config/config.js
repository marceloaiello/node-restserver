//=============
// puerto
//===========
process.env.PORT = process.env.PORT || 3000;


//=============
// entorno
//===========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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