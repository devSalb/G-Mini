import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Solicitacoes = new Schema({
    nome: {
        type: String,
        require: true
    },
    idProfessor: {
        type: Schema.Types.ObjectId,
        ref: "funcionarios",
        require: true
    },
    idMinipauta: {
        type: Schema.Types.ObjectId,
        ref: "minipautas",
        require: true
    },
    turma: {
        type: String,
        require: true
    },
    contacto: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    estado: {
        type: String,
        default: "N/Atendida"
    },
    data: {
        type: Date,
        default: new Date()
    }
    
})

const solicitacoes  = mongoose.model("solicitacoes", Solicitacoes)
export default solicitacoes