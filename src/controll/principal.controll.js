import { findAllCursosService } from "../services/curso.service.js";
import { createVisita } from "../services/visitantes.servece.js";


export const principal = async (req, res) => {
    try {
        //await createVisita()        
        return res.render("principal/home")
    } catch (error) {
        return res.status(500).send({mesage: error.message})
    }
}