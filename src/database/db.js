import mongoose from "mongoose"
const connectDB = () => {
    console.log("Aguardando a conexão com o Mongodb Atla...")

    mongoose.Promise = global.Promise;


    //Trabalhando com a conexáo do Atlas 
    mongoose.connect("mongodb+srv://devsalb9_db_user:CMUvwqoMF7S58ctJ@cluster0.aquxdbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
        console.log("BD G-MINI Mongo Atlas conectado em online!")
    }).catch((erro) => {
        console.log("Erro de Conexão com Mongo Atlas: " + erro)
        
        mongoose.connect('mongodb://127.0.0.1/G-MINI').then(()=>{
        console.log("BD Local(G-MINI) conectado com sucesso!")
        }).catch((erro)=>{
        console.log("Erro de Conexão com o BD Local: " + erro)
        })
    })  
}





export default connectDB;