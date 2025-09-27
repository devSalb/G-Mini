import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Funcionario = new Schema({
    nome: {
        type: String,
        required: true
    },
    numBI: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    telefone: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        require: true
    },
    dataNascimento: {
        type: Date,
        require: true
    },
    estadoCivil: {
        type: String,
        require: true
    },
    centro: {
        type: String,
        require: true
    },
    foto: {
        type: String,
        require: true
    },
    areaFormacao: {
        type: String,
        require: true
    },
    morada: {
        type: String,
        require: true
    },
    nivelAcademico: {
        type: String,
        require: true
    },
      usuario: {
         type: String,
         require: true
     },
     disciplinas: {
         type: Array,
         require: true
     }, 
     minipautas: {
         type: Array,
         require: true
     }, 
     turmas: {
         type: Array,
         require: true
     },  
     idAno: {
         type: String,
         require: true
     }, 
     categoria: {
         type: String,
         required: true
     }, 
     
})


const funcionario  = mongoose.model("funcionarios", Funcionario)
export default funcionario