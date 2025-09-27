
import Usuario from '../models/usuario.modles.js'
import jwt from 'jsonwebtoken'

export const findByUsernameService = (username) => Usuario.findOne({username: username}).lean();

export const generateToken = (id) => jwt.sign({id: id}, process.env.SECRET_JWT, {expiresIn: 86400})

export const createUserService = (novoUsuario) => Usuario(novoUsuario).save();

export const findAllUsers = () => Usuario.find().lean()

export const findUserBuNameService = (username) => Usuario.findOne({username: username}).lean();

export const findUserByIdService = (id) => Usuario.findById(id).lean()

export const findUserByIdAndDelet = (id) => Usuario.findByIdAndDelete(id)

export const findUserBIdAndUpdate = (id, usuario) => Usuario.findByIdAndUpdate(id, usuario)