import Visitantes from "../models/visitantes.modell.js";

export const createVisita = () => Visitantes().save()

export const findAllVisitasServece = () => Visitantes.find().lean()