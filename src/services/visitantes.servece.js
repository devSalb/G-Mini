import Visitantes from "../models/visitantes.modell.js";

export const createVisita = (visitante) => Visitantes(visitante).save()

export const findAllVisitasServece = () => Visitantes.find().lean()