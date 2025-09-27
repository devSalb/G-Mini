import { Router } from "express";
const router = Router()

import { addUser, allUsers, cadastrarse, createNewUserAluno, deletUser, editarSenha, editOutInformacoes, editPerfilUser, editUser, login, logout, perfil, perfilUser, telaLogin, wAddUser, wEditUser } from "../controll/usuario.controll.js";
import {validFildUser} from '../middlewares/user.middlewer.js'
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const upload = multer({storage: storage});

router.get('/todos', allUsers)
router.get('/login', telaLogin)
router.post('/login', login)
router.get('/logout', logout)
router.get('/add', wAddUser)
//router.post('/add', upload.single('fotoUser'), validFildUser, addUser)
router.post('/add', validFildUser, addUser)
router.get('/deletUser/:id', deletUser)
router.get('/editUser/:id', wEditUser)
router.post('/editUser', editUser)
router.post('/editPerfilUser', editPerfilUser)
router.post('/editOutInformacoes', editOutInformacoes)
router.post('/editarSenha', editarSenha)
router.get('/perfil', perfil)
router.get('/perfilUser', perfilUser)
router.get('/newUserAluno/:id', veryLogin, eAdmin, createNewUserAluno)
router.post('/cadastrarse', cadastrarse)


export default router