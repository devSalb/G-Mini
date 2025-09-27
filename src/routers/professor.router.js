import {Router} from "express"
import { addAlunoMinipauta, criarMiniPauta, curriculum, edidarMiniPauta, editarMiniPauta2, editarNotaMinipauta, eliminarAluno, eliminarMiniPauta, eliminarMiniPauta2, homeFormador, lancarNota, lancarNotaRep, lancarNotaRepSalve, minipauta, minipautas } from "../controll/professor.controll.js"
import { veryLogin } from "../../helpers/eAdmin.js"
import { selelectTrimestAndNotaDe } from "../middlewares/professor.middlewere.js"
const router = Router()


router.get("/curriculum", curriculum)
router.get("/:id", homeFormador)
router.post("/criarMinipauta", criarMiniPauta)
router.get("/minipautas/:id", minipautas)
router.get("/minipauta/:id", veryLogin, minipauta)
router.post("/lancarNota", veryLogin, lancarNota)
router.post("/addAluno", veryLogin, addAlunoMinipauta)
router.post('/lancarNotaRep', veryLogin, selelectTrimestAndNotaDe, lancarNotaRep)
router.post('/lancarNotaRepSalve', veryLogin, selelectTrimestAndNotaDe, lancarNotaRepSalve)
router.post('/eliminarAluno', veryLogin, eliminarAluno)
router.post('/editarNotaMinipauta/',veryLogin, editarNotaMinipauta)
router.get('/edidarMiniPauta/:id', veryLogin, edidarMiniPauta)
router.post('/editarMiniPauta/', veryLogin, editarMiniPauta2)
router.get('/eliminarMiniPauta/:id', veryLogin, eliminarMiniPauta)
router.post('/eliminarMiniPauta/', veryLogin, eliminarMiniPauta2)




export default router