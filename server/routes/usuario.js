const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middelwares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    /*
            return res.json({
            usuario: req.usuario,
            nombre: req.usuario.nombre,
            email: req.usuario.email
        });
    */

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //    let estadUsuario = req.query.estado || true;
    //
    //    let where = {
    //        estado: estadUsuario
    //    };


    //                campos que se devuelven  
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // debe recibir el mismo dato que el find()
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });

            });

        });
});


app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    //metod pick de underscore
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    //fisicamente
    //    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //        if (err) {
    //            return res.status(400).json({
    //                ok: false,
    //                err
    //            });
    //        };//

    //        if (!usuarioBorrado) {
    //            return res.status(400).json({
    //                ok: false,
    //                err: {
    //                    message: 'Usuario NO existente'
    //                }
    //            });
    //        };
    //        res.json({
    //            ok: true,
    //            usuario: usuarioBorrado
    //        });
    //});

    //logicamente
    let cambiaEtado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEtado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }; //
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario NO existente'
                }
            });
        };
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = app;