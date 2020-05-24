const jwt = require('jsonwebtoken');

//=====================
// verificar token

let verificaToken = (req, res, next) => {
    // lectura el header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }

        req.usuario = decoded.usuario;

        next()

    });

    //    res.json({
    //        token
    //    });

    //next();
};

//=====================
// verificar role

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "No es usuario Administrador"
            }
        });

    };
};



module.exports = {
    verificaToken,
    verificaAdmin_Role
};