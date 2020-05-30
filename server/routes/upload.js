const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    };

    //validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipos permitidos ' + tiposValidos.join(', '),
                tipo_recibido: tipo
            }
        });
    }



    let archivoRec = req.files.archivo;

    let nombreCortado = archivoRec.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //console.log(extension);
    //return res.json({ ok: false });

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'tif'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Extensión permitidas ' + extensionesValidas.join(', '),
                ext_recibida: extension
            }

        });

    }


    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivoRec.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //aqui esta la parte donde se actualiza el usuario o producto

        // esto lo quitamos porque lo pasamos por referencia a la funcion
        //res.json({
        //    ok: true,
        //    message: 'Imagen subida exitasomante'
        //});
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        };


    });

    function imagenUsuario(id, res, nombreArchivo) {
        Usuario.findById(id, (err, usuarioDB) => {
            if (err) {

                borraArchivo(nombreArchivo, 'usuarios')

                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!usuarioDB) {

                borraArchivo(nombreArchivo, 'usuarios')

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario No existe"
                    }
                })
            };

            borraArchivo(usuarioDB.img, 'usuarios')

            usuarioDB.img = nombreArchivo;

            usuarioDB.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };

                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo,
                    message: 'Usuario Actualizado'
                });


            });


        });

    };

    function imagenProducto(id, res, nombreArchivo) {
        Producto.findById(id, (err, productoDB) => {
            if (err) {

                borraArchivo(nombreArchivo, 'productos')

                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productoDB) {

                borraArchivo(nombreArchivo, 'productos')

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "producto No existe"
                    }
                })
            };

            borraArchivo(productoDB.img, 'productos')

            productoDB.img = nombreArchivo;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };

                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombreArchivo,
                    message: 'Producto Actualizado'
                });


            });


        });

    };


    function borraArchivo(nombreImagen, tipo) {

        let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

        //console.log(pathImagen);

        //aqui verificamos si existe la imagen y borramos la anterior para dejar una sola
        // si hiciera falta dejar el historico de cambios en vez de borrar se podria mover
        // a otra carpeta...#todo

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        };


    }

});


module.exports = app;