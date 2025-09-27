import localStrategy from 'passport-local'
import bcrypt from 'bcryptjs'
//import dotenv from 'dotenv';
//import userServece from '../services/user.servece.js';
//import jwt from 'jsonwebtoken';
//dotenv.config()

//Model de usuario
import Usuario from '../models/usuario.modles.js'


/* ANTIGO */
export const authMidleware = function(passport){

    passport.use(new localStrategy({usernameField: 'username', passwordField: 'senha'}, (username, senha, done)=>{
        Usuario.findOne({username: username}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: 'Esta conta não existe!'})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) =>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'senha ou usuário errado!'})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
    })
    passport.deserializeUser((id, done) => {
        let usuario = []
        let err= []

        Usuario.findById(id).then((user)=>{
            usuario = user
            done(null, usuario)
            //console.log(usuario)
        }).catch((err)=>{
            err = err
        })
    })
}

export const authMidlewareEditSenha = function(passport){

    passport.use(new localStrategy({usernameField: 'username', passwordField: 'senha'}, (username, senha, done)=>{
        Usuario.findOne({username: username}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: 'Esta conta não existe!'})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) =>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'A senha antiga está errada!'})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
    })
    passport.deserializeUser((id, done) => {
        let usuario = []
        let err= []

        Usuario.findById(id).then((user)=>{
            usuario = user
            done(null, usuario)
            //console.log(usuario)
        }).catch((err)=>{
            err = err
        })
    })
}


//Verificar se está logado
/* 
export const veryLogin = (req, res, next) => {

    try {
        
        const authorization = req.body.tok
        if(!authorization){
            return res.status(401).send('Acesso negado!')
        }
        const parts = authorization.split(" ")
        if(parts.length !== 2){
            return res.status(401).send('Acesso negado! <br> O tokem so pode ter duas palabras!: Bear Token')
        }
        const [schema, token] = parts;
        if(schema !== 'Bear'){
            return res.status(401).send('Acesso negado! <br> A primeira palavra deve ser Bear!: Bear Token')
        }

        //Validando o token com jesonwebtoken
        jwt.verify(token, process.env.SECRET_JWT, async (erro, decoded) => {
            if(erro){
            return res.status(401).send('Acesso negado!')
            }
            const user = await userServece.findById(decoded.id);
            if(!user){
            return res.status(401).send('Usuario não existente!')
            }
            req.userId = decoded.id;
            return next()
        })
    } catch (error) {
        res.status(500).send({message: error.message})
    }


} */

/* NOA CONFIG */
/* 
export const authMidleware = function (passport) {

    function findUser(username) {
        return Usuario.find(user => user.username === username);
    }

    function findUserById(id) {
        return Usuario.find(user => user._id === id);
    }
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        try {
            const user = findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            try {
                const user = findUser(username);

                // usuário inexistente
                if (!user) { return done(null, false) }

                // comparando as senhas
                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid) return done(null, false)

                return done(null, user)
            } catch (err) {
                done(err, false);
            }
        }
    ));
} */