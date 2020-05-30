const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middelwares/autenticacion')

let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathImgNotFuound = path.resolve(__dirname, '../assets/images/images_not_found.png')
        res.sendFile(pathImgNotFuound);
    }

});





module.exports = app;