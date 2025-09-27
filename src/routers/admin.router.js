import { Router } from "express";
import { addAluno, admin, apagarAluno, apagarAluno2, atribGenero, backup, confirmarMatricula, edidarMiniPauta, editarFoto, editarMiniPauta2, editarNotaMinipauta, editarTurma, eliminarMiniPauta, eliminarMiniPauta2, eliminarNotasDisciplina, eliminarTurma, listaUserPDF, relUserSistema } from "../controll/admin.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/relUserSistema', veryLogin, eAdmin, relUserSistema)
router.get('/listaUserPDF/',veryLogin, eAdmin, listaUserPDF)
router.get('/backup', veryLogin, eAdmin, backup)
router.get('/:id', veryLogin, eAdmin, admin)
router.post('/editFoto', veryLogin, editarFoto)
router.post('/addAluno',veryLogin, eAdmin, addAluno)
router.post('/atribGenero',veryLogin, eAdmin, atribGenero)
router.get('/apagarAluno/:id', veryLogin, eAdmin, apagarAluno)
router.post('/apagarAluno2/', veryLogin, eAdmin, apagarAluno2)
router.get('/eliminarMiniPauta/:id', veryLogin, eAdmin, eliminarMiniPauta)
router.get('/edidarMiniPauta/:id', veryLogin, eAdmin, edidarMiniPauta)
router.post('/eliminarMiniPauta/', veryLogin, eAdmin, eliminarMiniPauta2)
router.post('/editarMiniPauta/', veryLogin, eAdmin, editarMiniPauta2)
router.post('/eliminarTurma/', eAdmin, eliminarTurma)
router.post('/editarTurma/',veryLogin, eAdmin, editarTurma)
router.post('/editarNotaMinipauta/',veryLogin, editarNotaMinipauta)
router.get('/eliminarNotasDisciplina/:id', veryLogin, eAdmin, eliminarNotasDisciplina)
router.post('/confirmarMatricula/',veryLogin, confirmarMatricula)



export default router