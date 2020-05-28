const express = require('express');

const { verificaToken } = require('../middelwares/autenticacion');

let app = express();
let Producto = require('../models/producto');


app.get('/producto', verificaToken, function(req, res) {
    //console.log(req.query);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') //con esto vinculo las tablas y pongo los campos que quiero que devuelva
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // debe recibir el mismo dato que el find()
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    producto,
                    total: conteo
                });

            });

        });
});


app.get('/producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    //Producto.findById(id, (err, productoDB) => {
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'producto No encontrado'
                    }
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encuetra el producto"
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            });


        });

});

//==========================
// buscar producto
//==========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    console.log('por termino');
    let termino = req.params.termino;

    let exprRegular = new RegExp(termino, 'i');

    Producto.find({ nombre: exprRegular })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto || producto.length === 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encuetra ningún producto con ese nombre"
                    }
                });
            };
            res.json({
                ok: true,
                producto,
            });

        });


});

app.post('/producto', verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Producto no se pudo guardar",
                    err
                }
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se puedo dar de alta el Producto"
                }
            });
        };


        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

app.put('/producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    //metod pick de underscore
    let body = req.body;

    Producto.findById(id)
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Erro en la base de datos'
                    }
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encuetra el producto"
                    }
                });
            };

            productoDB.nombre = body.nombre === undefined ? productoDB.nombre : body.nombre
            productoDB.precioUni = body.precioUni === undefined ? productoDB.precioUni : body.precioUni
            productoDB.descripcion = body.descripcion === undefined ? productoDB.descripcion : body.descripcion
            productoDB.categoria = body.categoria === undefined ? productoDB.categoria : body.categoria
            productoDB.disponible = body.disponible === undefined ? productoDB.disponible : body.disponible

            productoDB.save((err, productoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "No se puedo actualizar el producto"
                        }
                    });
                };

                res.json({
                    ok: true,
                    producto: productoActualizado
                });

            })

        });


});



app.delete('/producto/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    Producto.findById(id)
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Erro en la base de datos'
                    }
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se encuetra el producto"
                    }
                });
            };

            //solo busco  el parametro y lo cambio, el resto lo manda igual.

            productoDB.disponible = false;

            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                if (!productoBorrado) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "No se puedo actualizar el producto"
                        }
                    });
                };

                res.json({
                    ok: true,
                    producto: productoBorrado
                });

            })

        });



});






module.exports = app;