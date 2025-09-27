
import Usuario from '../models/usuario.modles.js'
import jwt from 'jsonwebtoken'

export const findByUsernameService = (username) => Usuario.findOne({username: username}).lean();

export const generateToken = (id) => jwt.sign({id: id}, process.env.SECRET_JWT, {expiresIn: 86400})

export const createUserService = (novoUsuario) => Usuario(novoUsuario).save();

export const findAllUsers = () => Usuario.find().lean()

export const findUserBuNameService = (nome) => Usuario.findOne({nome: nome}).lean();

export const findUserByUsername = (username) => Usuario.findOne({username: username}).lean();

export const findUserByIdService = (id) => Usuario.findById(id).lean()

export const findUserByNumBIService = (numBI) => Usuario.findOne({numBI: numBI}).lean()

export const findUserByIdAndDelet = (id) => Usuario.findByIdAndDelete(id).lean()

export const findUserBIdAndUpdate = (id, usuario) => Usuario.findByIdAndUpdate(id, usuario)