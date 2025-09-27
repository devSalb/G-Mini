import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Aluno = new Schema({
    nome: {
        type: String,
        require: true
    },
    numBI: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        require: true
    },
    dataNascimento: {
        type: Date,
        require: true,
    },
    idade: {
        type: Number,
        require: true
    },
    curso: {
        type: String,
        require: true
    },
    estadoCivil: {
        type: String,
        require: true
    },
    pai: {
        type: String,
        require: true
    },
    mae: {
        type: String,
        require: true
    },
    naturalidade: {
        type: String,
        require: true
    },
    provincia: {
        type: String,
        require: true
    },
    municipio: {
        type: String,
        require: true
    },
    tipoDocumento: {
        type: String,
        require: true
    },
    dataEmissaoBI: {
        type: String,
        require: true
    },
    dataValidadeBI: {
        type: String,
        require: true
    },
    nacionalidade: {
        type: String,
        require: true
    },
    numContribuinte: {
        type: String,
        require: true
    },
    endereco: {
        type: String,
        require: true
    },
    bairro: {
        type: String,
        require: true
    },
    localidade: {
        type: String,
        require: true
    },
    nomeEncarregado: {
        type: String,
        require: true
    },
    nivelAcademico: {
        type: String,
        default: '',
        require: true
    },
    areaFormacao: {
        type: String,
        default: '',
        require: true
    },
    instituicaoEnsino: {
        type: String,
        default: '',
        require: true
    },
    contactoEncarregado: {
        type: String,
        default: '',
        require: true
    },
    telefone: {
        type: String,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    idMinipaura: {
        type: Schema.Types.ObjectId,
        ref: "minipautas",
        require: true
    },
    disciplinas: {
        type: Array,
        require: true
    },
    classe: {
        type: String,
        require: true
    },
    categoria: {
        type: String,
        require: true
    },
    matricula: {
        type: String,
        default: 'Não confirmada'
    },
    matriculado: {
        type: Boolean,
        default: false
    },
    idTurma: {
        type: String,
        require: true
    },
    idClasse: {
        type: String,
        require: true
    },
    idCurso: {
        type: String,
        require: true
    },
    idAno: {
        type: String,
        require: true
    },
    faltas: {
        type: Number,
        require: true
    },
    idProfessor: {
        type: String,
        require: true
    },
    concluido: {
        type: String,
        require: true
    },
    foto: {
        type: String,
        require: true
    },
    bilhete: {
        type: String,
        require: true
    },
    estado: {
        type: String,
        require: true
    },
    candidato: {
        type: Boolean,
        require: true
    },
    admitido: {
        type: Boolean,
        require: true
    },
    dataInscrito: {
        type: Date,
        default: new Date()
    }

})


const aluno = mongoose.model("alunos", Aluno)
export default aluno