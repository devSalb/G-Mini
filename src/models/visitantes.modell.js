import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Visitantes = new Schema({
    nome: {
        type: String,
        default: "Visita"
    },
    data: {
        type: Date,
        default: new Date()
    }
    
})

const visitantes  = mongoose.model("visitantes", Visitantes)
export default visitantes