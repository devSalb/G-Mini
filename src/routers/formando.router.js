import {Router} from 'express'
import { consultar, ficha } from '../controll/formando.controll.js'
const router = Router()

router.get("/ficha/:id", ficha)
router.post("/consultar", consultar)


export default router