import Aluno from "../models/aluno.modell.js";

export const findAllFormandosService = () => Aluno.find().lean()

export const findFormandoByUser = (idUser) => Aluno.findOne({usuario: idUser}).lean()

export const findAlunosMatriculados = (matriculado) => Aluno.find({matriculado: matriculado}).sort({nome: 1}).lean()

export const createFormandoService = (formando) => Aluno(formando).save()

export const findFormandoBymumBIServece = (numBI) => Aluno.findOne({numBI: numBI}).lean()

export const findFormandosByIdCurso = (idCurso) => Aluno.find({idCurso: idCurso}).lean()

export const findFormandosByIDTurmaService = (idTurma) => Aluno.find({idTurma: idTurma}).lean()

export const findAlunosByIDMinipauta = (idMinipauta) => Aluno.find({idMinipauta: idMinipauta}).lean()

export const findFormandosInscritosServece = () => Aluno.find({candidato: false}).lean()

export const findFormandoByIdServise = (idFormando) => Aluno.findOne({_id: idFormando}).lean()

export const findFormandoByIdAndDelete = (idFormando) => Aluno.findByIdAndDelete(idFormando)

export const findFormandoAndUpdateServece = (idFormando, dados) => Aluno.findByIdAndUpdate(idFormando, dados).lean()

export const createAlunoService = (aluno) => Aluno(aluno).save()


export const findAlunoByBIService = (bi) => Aluno.findOne({numBI: bi}).lean()

export const findAlunoByNomeServce = (nome) => Aluno.findOne({nome: nome}).lean()

export const findAlunosByIdTurma = (idTurma) => Aluno.find({idTurma: idTurma}).sort({nome: 1}).lean()

export const findAlunoByIdService = (idAluno) => Aluno.findOne({_id: idAluno}).populate('usuario').lean()

export const findAlunoByIdUser = (id) => Aluno.findOne({usuario: id}).lean()

export const findAlunosByIdAnoService = (idAno) => Aluno.find({idAno: idAno}).sort({nome: 1}).lean()

export const findAlunosByIdCursoService = (idCurso) => Aluno.find({idCurso: idCurso}).sort({nome: 1}).lean()

export const findAlunoByNumBIService = (numBI) => Aluno.findOne({numBI: numBI}).lean()

export const findAlunoAnDeleteSercice = (idAluno) => Aluno.findByIdAndDelete(idAluno).lean()

export const findAlunoByIdAndUpdate = (idAluno, aluno) => Aluno.findByIdAndUpdate(idAluno, aluno)

