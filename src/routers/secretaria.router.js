import {Router} from 'express'
import { secretariaHome } from '../controll/secretaria.controll.js'
const router = Router()


router.get('/', secretariaHome)


export default router