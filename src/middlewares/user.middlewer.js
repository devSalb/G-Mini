import { findFormandoByIdServise, findFormandoBymumBIServece } from "../services/alunos.servece.js"
import { findUserByIdService, findUserByUsername } from "../services/usuario.service.js"
import validator from 'validator'

export const validFildUser = (req, res, next) => {
    try {
        const erros = []
        const { id, numero, nome, email, telefone, senha, senha2, categoria, genero, nivelAcademico, area, cursos } = req.body
        const username = email
        //return res.send({username})

        if (!username || username.length < 2 || typeof username == undefined || username == null) {
            erros.push({ texto: 'O Nome de usuario invalido' })
        }

        if (!req.body.senha || typeof req.senha == undefined || req.body.senha == null) {
            erros.push({ texto: 'senha invalida' })
        }
        if (req.body.senha !== req.body.senha2) {
            erros.push({ texto: 'As senhas não correspondem!' })
        }

        if (req.body.senha.length < 2) {
            erros.push({ texto: 'Senha muito curta! A senha deve ter no mínimo 4 caracter.' })
        }

        if (erros.length > 0) {
            return res.render('admin/addUser', { erros })
        }
        next()
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const validFildFuncio = async (req, res, next) => {
    try {
        const { id, numero, nome, email, telefone, centro, senha, senha2, categoria, genero, numBI, dataNascimento, morada, estadoCivil, nivelAcademico, areaFormacao } = req.body

        let mesageErr = []
        if (centro == "") { mesageErr.push({ texto: "Por favor, selecione o centro de formação;" }) }
        if (categoria == "") { mesageErr.push({ texto: "Por favor, seleciona a Categoria; " }) }
        if (estadoCivil == "") { mesageErr.push({ texto: "Por favor, selecione o estado civil;" }) }
        if (nivelAcademico == "") { mesageErr.push({ texto: "Por favor, selecione o nível académico;" }) }
        if(req.body.cliente){
            if (senha != senha2) { return res.send( "As senhas não são iguais. Por favor repete a mesma senha na conformação." ) }
        }else{
            if (senha != senha2) { mesageErr.push({ texto: "As senhas não são iguais. Por favor repete a mesma senha na conformação.;" }) }
        }

        const pesquiUser = await findUserByUsername(email)
        if (pesquiUser) { mesageErr.push({ texto: "Já existe um usuário com este email '" + email + "'" }) }

        if (mesageErr != "") {
            //req.flash("error_msg", ""+mesageErr)
            return res.render("rH/adFuncionarioR", { mesageErr, id, numero, nome, email, telefone, centro, senha, senha2, categoria, genero, numBI, dataNascimento, morada, estadoCivil, nivelAcademico, areaFormacao })
            //return res.send(mesageErr)
        }

        next()

    } catch (error) {
        return res.send({ mesage: error.mesage })
    }
}

export const validFildFormando = async (req, res, next) => {
    try {
        let mesageErr = []
        let { email, senha, senha2, categoria, nome, numBI, id, numero, centro, genero, dataNascimento, lingua, dataAdmissao, dataSaida, curso, estadoCivil, inicioCarreiraP, ultimoActEmpregador, carteiraProf, especialidade, grupoProfissional, naturalidade, provincia, municipio, tipoDocumento, dataEmissaoBI, dataValidadeBI, necessidadeEspecial, descricaoNEE, outInfPessoais, arquivo, nacionalidade, numContribuinte, endereco, bairro, localidade, nivelAcademico, areaFormacao, instituicaoEnsino, cursosReferentes, telefone, telefone2, telefixo, usuario, candidato } = req.body

            //return res.send(candidato)


        // Remove espaços e caracteres não numéricos
        const telefoneLimpo = telefone.replace(/\D/g, '');

        // Verifica se o telefone tem entre 10 e 15 dígitos
        if (validator.isLength(telefoneLimpo, { min: 9, max: 9 })) {
            telefone = telefoneLimpo
        } else {
            mesageErr.push({ texto: "Número de telefone inválido!" });
        }


        if (centro == "") { mesageErr.push({ texto: "Por favor, selecione o centro de formação;" }) }
        if (categoria == "") { mesageErr.push({ texto: "Por favor, seleciona a Categoria; " }) }
        if (estadoCivil == "") { mesageErr.push({ texto: "Por favor, selecione o estado civil;" }) }
        if (nivelAcademico == "") { mesageErr.push({ texto: "Por favor, selecione o nível académico;" }) }
        if (senha != senha2) { mesageErr.push({ texto: "As senhas não são iguais. Por favor repete a mesma senha na conformação.;" }) }

        const pesquiUser = await findUserByUsername(email)
        const pesquiFormando = await findFormandoBymumBIServece(numBI)
        if (pesquiUser) { mesageErr.push({ texto: "Já existe um usuário com este email '" + email + "'" }) }
        if (pesquiFormando) { mesageErr.push({ texto: "Já existe um usuário com este nº de Documento '" + numBI + "'" }) }

        if (mesageErr != "") {
            //req.flash("error_msg", ""+mesageErr)
            return res.render("formando/novoformandoR", { mesageErr, email, senha, senha2, categoria, nome, numBI, id, numero, centro, genero, dataNascimento, lingua, dataAdmissao, dataSaida, curso, estadoCivil, inicioCarreiraP, ultimoActEmpregador, carteiraProf, especialidade, grupoProfissional, naturalidade, provincia, municipio, tipoDocumento, dataEmissaoBI, dataValidadeBI, necessidadeEspecial, descricaoNEE, outInfPessoais, arquivo, nacionalidade, numContribuinte, endereco, bairro, localidade, nivelAcademico, areaFormacao, instituicaoEnsino, cursosReferentes, telefone, telefone2, telefixo, usuario, candidato })
        }

        next()

    } catch (error) {
        return res.send({ mesage: error.mesage })
    }
}

export const validFildFormandoEdit = async (req, res, next) => {
    try {
        const { email, senha, senha2, categoria, nome, numBI, id, numero, centro, genero, dataNascimento, lingua, dataAdmissao, dataSaida, curso, estadoCivil, inicioCarreiraP, ultimoActEmpregador, carteiraProf, especialidade, grupoProfissional, naturalidade, provincia, municipio, tipoDocumento, dataEmissaoBI, dataValidadeBI, necessidadeEspecial, descricaoNEE, outInfPessoais, arquivo, nacionalidade, numContribuinte, endereco, bairro, localidade, nivelAcademico, areaFormacao, instituicaoEnsino, cursosReferentes, telefone, telefone2, telefixo, usuario } = req.body
        const formandoParaEditar = await findFormandoByIdServise(req.body.idFormando)
        const usuarioParaEditar = await findUserByIdService(formandoParaEditar.usuario)
        //return res.send({usuarioParaEditar})

        let mesageErr = []
        if (centro == "") { mesageErr.push({ texto: "Por favor, selecione o centro de formação;" }) }
        if (categoria == "") { mesageErr.push({ texto: "Por favor, seleciona a Categoria; " }) }
        if (estadoCivil == "") { mesageErr.push({ texto: "Por favor, selecione o estado civil;" }) }
        if (nivelAcademico == "") { mesageErr.push({ texto: "Por favor, selecione o nível académico;" }) }
        if (senha != senha2) { mesageErr.push({ texto: "As senhas não são iguais. Por favor repete a mesma senha na conformação.;" }) }

        const pesquiUser = await findUserByUsername(email)
        const pesquiFormando = await findFormandoBymumBIServece(numBI)
        if (pesquiUser) {
            if (usuarioParaEditar._id != "" + pesquiUser._id) { mesageErr.push({ texto: "Já existe um usuário com este email '" + email + "'" }) }
        }
        if (pesquiFormando) {
            if (formandoParaEditar._id != "" + pesquiFormando._id) { mesageErr.push({ texto: "Já existe um usuário com este nº de Documento '" + numBI + "'" }) }
        }

        if (mesageErr != "") {
            //req.flash("error_msg", ""+mesageErr)
            return res.render("formando/editarFormando", { mesageErr, email, senha, senha2, categoria, nome, numBI, id, numero, centro, genero, dataNascimento, lingua, dataAdmissao, dataSaida, curso, estadoCivil, inicioCarreiraP, ultimoActEmpregador, carteiraProf, especialidade, grupoProfissional, naturalidade, provincia, municipio, tipoDocumento, dataEmissaoBI, dataValidadeBI, necessidadeEspecial, descricaoNEE, outInfPessoais, arquivo, nacionalidade, numContribuinte, endereco, bairro, localidade, nivelAcademico, areaFormacao, instituicaoEnsino, cursosReferentes, telefone, telefone2, telefixo, usuario })
            //return res.send(mesageErr)
        }

        next()

    } catch (error) {
        return res.send({ mesage: error.mesage })
    }
}