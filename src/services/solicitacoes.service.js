import Solicitacoes from '../models/solicitacoes.modell.js'


export const createSolicitacao = (solicitacao) => Solicitacoes(solicitacao).save()

export const findSolicitacaoByIDServece = (idSolic) => Solicitacoes.findById(idSolic).lean()

export const findSolicitacaoByIDAndDeleteServece = (idSolic) => Solicitacoes.findByIdAndDelete(idSolic).lean()

export const findSolicitacaoByIDAndUpdateServece = (idSolic) => Solicitacoes.findByIdAndUpdate(idSolic).lean()

export const findAllSolicitacoesServece = () => Solicitacoes.find().lean()

export const findSolicitacoesByIDProfessorServece = (idProfessor) => Solicitacoes.find({idProfessor: idProfessor}).lean()