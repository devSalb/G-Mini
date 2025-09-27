import {Router} from "express"
import { modelosMinipauta } from "../controll/modelosMin.controll.js";
const router = Router();

router.get("/", modelosMinipauta)




export default router