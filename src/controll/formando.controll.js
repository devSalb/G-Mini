import { findFormandoBymumBIServece, findFormandoByUser } from "../services/alunos.servece.js"
import { findTurmaByIdService } from "../services/turma.service.js"
import { findUserByIdService } from "../services/usuario.service.js"



export const ficha = async (req, res) => {
    try {
        const idUser = req.params.id
        let docEmFalta = false
        let formando = await findFormandoByUser(idUser)
        if(formando.idTurma){
            const turma = await findTurmaByIdService(formando.idTurma)
            formando.turma = turma.nomeTurma
        }
        const user = await findUserByIdService(idUser)

        /* Verificar o nível de acesso */
        let autorizado = false
        const userLog = req.user
        if(userLog){
            if(userLog.categoria == "secretario" || userLog.categoria == "admin"){autorizado = true}
        }

        //return res.send({formando})
        if(formando.genero == "F"){formando.femenino = "F"}else{formando.masculino = "M"}
        
        formando.idade = parseInt(new Date().getFullYear()) - parseInt(formando.dataNascimento.getFullYear())
        formando.dataNascimento = formando.dataNascimento.getDate()+"/"+formando.dataNascimento.getMonth()+"/"+formando.dataNascimento.getFullYear()

        /* Verificar se ha documentos em falta */
        if(formando.foto == null || formando.bilhete == null || formando.certificado == null){docEmFalta == true}
        res.render("formando/ficha", {formando, autorizado, docEmFalta})
    } catch (error) {
        return res.status(500).send({mesage: error.mesage})
    }
}

export const consultar = async (req, res) => {
    try {
        const {numBI} = req.body
        const formando = await findFormandoBymumBIServece(numBI)
        //return res.send({formando})
        if(!formando){
            req.flash("error_msg", "Nenhum resultado encontrado. Certifica-se que efetuaste a inscrição ou envie-nos uma mensaqgem com o comprovativo de inscrição pelo Whatsap: 937571523 ")
            return res.redirect("/")
        }
        return res.redirect("/pedagogico/comprovativo/"+formando._id)
    } catch (error) {
        return res.status(500).send({mesage: error.mesage})
    }
}