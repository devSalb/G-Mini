import {Router} from 'express'
import { homeAdministrativo } from '../controll/adimistrativo.controll.js'
const router = Router()


router.get('/', homeAdministrativo)


export default router