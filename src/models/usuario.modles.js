import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    numBI: {
        type: String,
        require: true
    },
    username: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        require: true
    },
    telefone: {
        type: String,
        default: ''
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    eAdminDev: {
        type: Boolean,
        default: false
    },
    privilegio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: String,
        require: true
    },
    idUser: {
        type: String,
        require: true
    },
    numero: {
        type: Number,
        require: true
    },
    area: {
        type: String,
        require: true
    },
    cursos: {
        type: String,
        require: true
    },
    nivelAcademico: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    dev: {
        type: Boolean,
        default: false
    },
})

Usuario.pre('save', async function (next){
    this.senha = await bcrypt.hash(this.senha, 10)
    next();
})

const usuario  = mongoose.model("users", Usuario)
export default usuario