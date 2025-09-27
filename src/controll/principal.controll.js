import { createVisita } from "../services/visitantes.servece.js";


export const principal = async (req, res) => {
    try {
        const visitante = {
            nome: "Visita"
        }
        //await createVisita(visitante)        
        return res.render("principal/home")
    } catch (error) {
        return res.status(500).send({mesage: error.message})
    }
}