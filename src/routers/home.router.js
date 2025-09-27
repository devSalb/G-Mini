import { Router } from "express";
import { principal } from "../controll/principal.controll.js";

const router = Router()

router.get("/", principal)



export default router