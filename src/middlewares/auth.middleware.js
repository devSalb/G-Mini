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


