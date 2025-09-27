import {Router} from 'express'
import { solicitacoes, solicitarPDF } from '../controll/solicitacoes.controll.js'
const router = Router()


router.get('/', solicitacoes)
router.post('/solicitarPDF', solicitarPDF)


export default router