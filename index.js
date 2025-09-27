import express from "express"
import session from "express-session"
import flash from 'connect-flash'
import passport from 'passport'
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();

import handlebars from  'express-handlebars'
import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
const port = 8081
import connectDB from  "./src/database/db.js"
import syDefinicoes from "./config/definicoesSy.js"
const app = express()

//Importação das rotas
    import homeRouter from './src/routers/home.router.js'
    import userRouter from './src/routers/usuario.router.js'
    import adminRouter from './src/routers/admin.router.js'
    import pedagogicoRouter from './src/routers/pedagogico.router.js'
    import professorRouter from './src/routers/professor.router.js'
    import administrativoRouter from './src/routers/adimistrativo.router.js'
    import secretariaRouter from './src/routers/secretaria.router.js'
    import rHRouter from './src/routers/rH.router.js'
    import formandoRouter from './src/routers/formando.router.js'
    import modelosRouter from './src/routers/modelosMin.routers.js'
    import solicitacoesRouter from './src/routers/solicitacoes.router.js'

    //Config do Backup
    import { spawn } from "child_process"
    const DB_NAME = '\B'
    const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`)

   
    async function backupMongoDB(){
        const child = await spawn('mongodump', [
            `--out`,
            `C://BackupAndulo`
        ])

        await child.stdout.on('data', (data) => {
            console.log('stdout:\n', data)
        })
        await child.stderr.on('data', (data) => {
            console.log('stderr:\n', data)
        })
        child.on('error', (error) => {
            console.log('error:\n', error)
        })
        await child.on('exit', (code, signal) => {
            if(code) console.log('Process extit with code:', code)
            else if (signal) console.log('Process killed with signal:', signal)
            else console.log('backup realizado com sucesso!')
        })
        
    }
    function restoreMongoDB(){
        const child = spawn('mongorestore', [
            `C://BackupAndulo`
        ])

        child.stdout.on('data', (data) => {
            console.log('stdout:\n', data)
        })
        child.stderr.on('data', (data) => {
            console.log('stderr:\n', data)
        })
        child.on('error', (error) => {
            console.log('error:\n', error)
        })
        child.on('exit', (code, signal) => {
            if(code) console.log('Process extit with code:', code)
            else if (signal) console.log('Process killed with signal:', signal)
            else console.log('restauro realizado com sucesso!')
        })
        
    }
    


//Configurações
//sessão
app.use(session({
    secret: 'tfcispb2023',
    resave: false,
    saveUninitialized: false
    //cookie: { maxAge: 30 * 60 * 1000 }//30min
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//conf middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next()
})

//Configurar para armazenar cookie
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))



//Confi
//Tamplate

        app.use(express.static(__dirname + '/public'));

        app.engine("handlebars", handlebars.engine({
            defaultLayout: "main",
            layoutsDir: path.join(__dirname, "views", "layouts")
        }));
        app.set("view engine", "handlebars");
        app.set("views", path.join(__dirname, "views"))
    //Conectar BD e crir definições do systema se não existir 
   connectDB()
   //syDefinicoes() //Esta função cria a definição do sistema, uma única vez

//Body Parser
import bodyParser from 'body-parser'
//import router from "./src/routes/user.routes.js"
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())




//ROTAS
        //PRINCIPAL
        app.use('/', homeRouter)
        app.use('/usuario/', userRouter) // Usuários
        app.use('/admin/', adminRouter) // Admin
        app.use('/pedagogico/', pedagogicoRouter) // Admin
        app.use('/professor', professorRouter) // Formador
        app.use('/administrativo', administrativoRouter) // Administrativo
        app.use('/secretaria', secretariaRouter) // Secretaria
        app.use('/rH', rHRouter) // Recursos Humanos
        app.use('/formando', formandoRouter)
        app.use('/modelosMinipauta', modelosRouter)
        app.use('/solicitacoes', solicitacoesRouter)

 
        //Rota do backup
        app.get('/backup', (req, res)=>{
            try {
            backupMongoDB()
            req.flash('success_msg', 'Backup realizado do com sucesso!')
            res.redirect('/admin/backup')
            
        } catch (error) {
            res.status(500).send({mesage: error.mesage})
        }
    })

        //Rota do restauro
        app.get('/restore', (req, res)=>{
            try {
            restoreMongoDB()
            req.flash('success_msg', 'Dados restaurados com sucesso!')
            res.redirect('/admin/backup')
            
        } catch (error) {
            res.status(500).send({mesage: error.mesage})
        }
    })




app.listen(port, () => console.log("Servidor SGFPAO-ANDULO rodando..."))