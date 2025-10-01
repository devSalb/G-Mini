//Para restringir acesso
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { findUserByIdService } from '../src/services/usuario.service.js';
import cookieParser from 'cookie-parser';
dotenv.config()

export const eAdmin = (req, res, next) => {
    if (req.user.eAdmin === 1) {
        //return res.send(req.user)
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')

}
export const eSecret = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 2) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eSecretP = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 3) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eFinanc = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 4) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}

export const veryLogin = async (req, res, next) => {
    try {
        //return res.render('admin/pago')
        const myCookes = req.headers.cookie
        //console.log(req.cookies['access_token']);
        const myToken = req.cookies['access_token']
        //return res.send({myToken})

        const authorization = 'Bear ' + myToken
        //console.log({authorization}) 
        if (!authorization) {
            //return res.status(401).send('Acesso negado!')
            req.flash('error_msg', 'Tempo esgotado! Inicie novamente a sessão!')
            res.redirect('/usuario/login')
        }
        const parts = authorization.split(" ")
        if (parts.length !== 2) {
            //O tokem so pode ter duas palabras!: Bear Token
            //return res.status(401).send('Acesso negado!')
            req.flash('error_msg', 'Tempo esgotado! Inicie novamente a sessão!')
            res.redirect('/usuario/login')
        }
        const [schema, token] = parts;
        if (schema !== 'Bear') {
            //A primeira palavra deve ser Bear!: Bear Token
            return res.status(401).send('Acesso negado!')
        }
        //Validando o token com jesonwebtoken
        jwt.verify(token, process.env.SECRET_JWT, async (erro, decoded) => {
            if (erro) {
                //Token invalido
                // return res.status(401).send('Acesso negado!')
                req.flash('error_msg', 'Tempo esgotado! Inicie novamente a sessão!')
                return res.redirect('/usuario/login')
            }
            const user = await findUserByIdService(decoded.id);
            if (!user) {
                return res.status(401).send('Usuario não existente!')
            }
            req.userId = user._id;
            req.user = user
            return next()
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
