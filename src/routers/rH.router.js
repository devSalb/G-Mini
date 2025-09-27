import {Router} from 'express'
import { adFuncionario, adFuncionarioPost, deletarFuncionario, homeRH, tdFormadores } from '../controll/rH.controll.js'
import { validFildFuncio } from '../middlewares/user.middlewer.js'
const router = Router()


router.get('/', homeRH)
router.get('/tdFormadores', tdFormadores)
router.get('/adFuncionario', adFuncionario)
router.post('/adFuncionario', validFildFuncio, adFuncionarioPost)
router.get('/deletarFuncionario/:id', deletarFuncionario)

export default router