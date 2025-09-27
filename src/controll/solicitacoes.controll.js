import { createSolicitacao, findAllSolicitacoesServece } from "../services/solicitacoes.service.js"


export const solicitacoes = async (req, res) => {
    try {
        const solicitacoes = await findAllSolicitacoesServece()
        res.render("solicitacoes/homeSolicitacoes", { solicitacoes })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const solicitarPDF = async (req, res) => {
    try {
        const solicitacao = req.body
        const {idMinipauta} = req.body
        //return res.send({solicitacao})
        const solicitacoe = await createSolicitacao(solicitacao)
        req.flash("success_msg", "A sua solicitação foi enviada com sucesso! Em breve atenderemos.")
        res.redirect("/professor/minipauta/" + idMinipauta)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}