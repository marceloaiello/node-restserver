const express = require('express');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdmin_Role } = require('../middelwares/autenticacion');
const app = express();

app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .sort('-descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // debe recibir el mismo dato que el find()
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    total: conteo
                });

            });

        });
});


app.get('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría No encontrada'
                }
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se encuetra la Categoria"
                }
            });
        };

        // debe recibir el mismo dato que el find()
        Categoria.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                categoria: categoriaDB,
                total: conteo
            });

        });


    });

});


app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Categoria ya existente"
                }
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se puedo dar de alta la Categoria"
                }
            });
        };


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.put('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    //metod pick de underscore
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findOneAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se puedo actualizar la Categoria"
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    //fisicamente
    Categoria.findByIdAndRemove(id, (err, CategoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }; //

        if (!CategoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría NO existente'
                }
            });
        };
        res.json({
            ok: true,
            categoria: CategoriaBorrada
        });
    });


});


module.exports = app;