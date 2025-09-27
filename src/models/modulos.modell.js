import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Modulos = new Schema({
    nomeModulo: {
        type: String,
        required: true
    },
    tempoSemanal: {
        type: Number,
        require: true
    },
    idClasse: {
        type: Schema.Types.ObjectId,
         ref: "classes",
         require: true
    },
    idProfessor: {
        type: Schema.Types.ObjectId,
         ref: "funcionarios",
         require: true
    },
    notas: {
        type: Array,
        require: true
    },
    idTurma: {
        type: Schema.Types.ObjectId,
         ref: "turmas",
         require: true
    },
    idCurso: {
        type: String,
        required: true
    },
    idAno: {
        type: String,
        require: true
    }
    
})


const modulo  = mongoose.model("modulos", Modulos)
export default modulo