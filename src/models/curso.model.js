import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Curso = new Schema({
    nomeCurso: {
        type: String,
        required: true
    },
    familia: {
        type: String,
        require: true
    },
    codigoCurso: {
        type: String,
        require: true
    },
    duracao: {
        type: String,
        require: true
    },
    tipoPrograma: {
        type: String,
        require: true
    },
    notaMinima: {
        type: Number,
        require: true
    },
    regraCalculo: {
        type: String,
        require: true
    },
    modalidade: {
        type: String,
        require: true
    },
    dataRevisao: {
        type: Date,
        require: true
    },
    certificacao: {
        type: String,
        require: true
    },
    lugaresMinimo: {
        type: Number,
        require: true
    },
    lugaresMaximo: {
        type: Number,
        require: true
    },
    tipoFormacao: {
        type: String,
        require: true
    },
    avaliacao: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    programa: {
        type: String,
        require: true
    },
    preco: {
        type: Number,
        require: true
    },
    moeda: {
        type: String,
        require: true
    },
    situacao: {
        type: String,
        require: true
    },
    classe10: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        require: true
    },
    classe11: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        require: true
    },
    classe12: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        require: true
    },
    coordenador: {
        type: Schema.Types.ObjectId,
        ref: "funcionarios",
        require: true
    },
    inscritos: {
        type: Number,
        require: true
    },
    vagas: {
        type: Number,
        default: 0
    },
    imagem: {
        type: String,
        require: true
    }
    
})


const curso  = mongoose.model("cursos", Curso)
export default curso