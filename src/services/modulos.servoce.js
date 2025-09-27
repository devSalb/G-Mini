import Modulo from "../models/modulos.modell.js";


export const createModulo = (modulo) => Modulo(modulo).save()

export const findModulosByIdCursoSercice = (idCurso) => Modulo.find({idCurso: idCurso}).lean()

export const findModulosByIdSercice = (idModulo) => Modulo.findOne({_id: idModulo}).lean()

export const findModulosByNomeSercice = (nomeModulo) => Modulo.findOne({nomeModulo: nomeModulo}).lean()

export const findModuloByIdAndUpdateService = (idModulo, modulo) => Modulo.findByIdAndUpdate(idModulo, modulo).lean()


