import fs from 'fs'
import pdf from 'html-pdf'
import ejs from 'ejs'

import { createFuncionarioService, findAllFuncionariosService, findFuncionarioAndDeleteService, findFuncionariosByIdService } from "../services/funcionario.service.js"
import { createUserService } from "../services/usuario.service.js"


export const homeRH = async (req, res) => {
    try {
        res.render('rH/homeRH')
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const tdFormadores = async (req, res) => {
    try {

        const funcionarios = await findAllFuncionariosService()
        res.render('rH/formadores', { funcionarios })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const adFuncionario = async (req, res) => {
    try {
        const funcionarios = await findAllFuncionariosService()
        const numero = funcionarios.length + 1
        const id = (numero * 3) - 1
        const data = new Date().getFullYear()
        const idString = id + "-F" + data
        res.render('rH/adFuncionario', { numero, idString })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const adFuncionarioPost = async (req, res) => {
    try {
        const { id, numero, nome, email, telefone, centro, senha, senha2, categoria, genero, numBI, dataNascimento, morada, estadoCivil, nivelAcademico, areaFormacao } = req.body
        const dados = req.body

        const novoUser = {
            nome: nome,
            username: email,
            senha: senha,
            telefone: telefone,
            categoria: categoria,
            idUser: id,
            numero: numero,
            area: areaFormacao,
            nivelAcademico: nivelAcademico
        }

        const userCriado = await createUserService(novoUser)
        const funcionario = {
            nome: nome,
            numBI: numBI,
            email: email,
            telefone: telefone,
            genero: genero,
            dataNascimento: dataNascimento,
            estadoCivil: estadoCivil,
            centro: centro,
            areaFormacao: areaFormacao,
            morada: morada,
            nivelAcademico: nivelAcademico,
            usuario: userCriado._id,
            categoria: categoria
        }
        const funcionarioCreated = await createFuncionarioService(funcionario)

        /* Este código verifica se é um cadastro de cliente pareredurecionar na pagina de login depois de criar conta */
        const {cliente} = req.body
        if(cliente){
            req.flash("success_msg", "A sua conta foi criada com sucesso pode fazer login")
            return res.redirect("/usuario/login")
        }

        req.flash("success_msg", "Cadastro realizado com sucesso!")
        return res.redirect("/rH/tdFormadores")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const deletarFuncionario = async (req, res) => {
    try {
        const id = req.params.id
        await findFuncionarioAndDeleteService(id)
        req.flash("error_msg", "Funcionario deletado!")
        return res.redirect("/rH/tdFormadores")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

