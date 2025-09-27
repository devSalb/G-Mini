import Curso from "../models/curso.model.js";


export const cadastrarCurso = (curso) => Curso(curso).save()

export const findAllCursosService = () => Curso.find().lean()

export const findCursoByNomeService = (nomeCurso) => Curso.findOne({nomeCurso: nomeCurso}).lean()

export const findCursoAndDeleteServece = (idCurso) => Curso.findByIdAndDelete(idCurso).lean()

export const findCursoByIDService = (idCurso) => Curso.findById(idCurso).lean()

export const findCursoByIdAndUpdateDServece = (curso, cursoUpdate) => Curso.findByIdAndUpdate(curso, cursoUpdate).lean()