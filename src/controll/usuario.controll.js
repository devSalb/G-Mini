import { createUserService, findAllUsers, findByUsernameService, findUserBIdAndUpdate, findUserByIdAndDelet, findUserByIdService, findUserByNumBIService, findUserByUsername, generateToken } from "../services/usuario.service.js"
import { authMidleware } from '../middlewares/auth.middleware.js'
import passport from 'passport'
//import { findAlunoByIdAndUpdate, findAlunoByIdService, findAlunoByIdUser } from "../services/aluno.service.js";
import cookieParser from 'cookie-parser'
import { findFuncionariosUser } from "../services/funcionario.service.js"
import bcrypt from 'bcryptjs'
import { findAllFormandosService } from "../services/alunos.servece.js"
import { findAllCursosService, findCursoByIDService } from "../services/curso.service.js"

//import { findFuncionariosUser } from "../services/funcionario.service.js";
//import { createRelUserService } from "../services/relUsuarios.service.js";
//import { findTurmaByIdService } from "../services/turma.service.js";

export const allUsers = async (req, res) => {
    try {
        //return res.send("Testando usuários")
        const usuarios = await findAllUsers();
        if (!usuarios) {
            req.flash('error_messag', 'Não ha usuário registrado!')
            res.redirect('/')
        } else {
            res.render('admin/usuario/tdUsers', { usuarios })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const telaLogin = (req, res) => {
    //return res.send("Testando")
    res.render('admin/usuario/telaLogin')
}
export const login = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await findUserByUsername(username)
        //return res.send({user})
        if (user == null) {
            //return res.send('Usuario não achado!')
            req.flash('error_msg', 'Usuario ou senha invalido')
            res.redirect('/usuario/login')

        } else {
            const id = user._id
            const token = await generateToken(user._id)
            res.cookie("access_token", token, { maxAge: 24 * 120 * 1000, httpOnly: true })
            const date = new Date();
            let dia = date.getDate();
            let mes = date.toLocaleString('default', { month: 'long' });
            let ano = date.getFullYear();
            // Criando relatório de acesso
            /* const relUsuarios = {
                username: user.username,
                diaDeAcesso: dia,
                mesDeAcesso: mes,
                anoDeAcesso: ano,
                horaDeAcesso: date.getHours()+' horas',
                categoria: user.categoria
                } */
            if (user.eAdmin == 1) {
                //relUsuarios.nomeDoUsuario = user.username + " - Administrador" // Identificar categoria do uruario e adicionar no relatório de acesso
                await authMidleware(passport)
                passport.authenticate('local', {
                    successRedirect: '/admin/' + id,
                    failureRedirect: '/usuario/login',
                    failureFlash: true
                })(req, res, next)
            } else {
                if (user.categoria == 'Professor') {
                    const funcionario = await findFuncionariosUser(user._id)
                    //return res.send({funcionario})
                    //relUsuarios.nomeDoUsuario = funcionario.nome
                    await authMidleware(passport)
                    passport.authenticate('local', {
                        successRedirect: '/professor/' + id,
                        failureRedirect: '/usuario/login',
                        failureFlash: true
                    })(req, res, next)
                } else {

                    if (user.categoria == 'formando') {
                        const formando = await findUserByIdService(id)
                        const idAluno = formando._id
                        //return res.send({formando})
                        //relUsuarios.nomeDoUsuario = aluno.nome
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/formando/ficha/' + idAluno,
                            failureRedirect: '/usuario/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'pedagogico') {
                        //return res.send('é pedagogico')
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/pedagogico',
                            failureRedirect: '/usuario/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'financeiro') {

                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/financas/',
                            failureRedirect: '/usuario/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'secretario') {

                        await authMidleware(passport)
                        //return res.redirect('/secretaria')
                        passport.authenticate('local', {
                            successRedirect: '/secretaria/',
                            failureRedirect: '/usuario/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == '******') {
                        await authMidleware(passport)
                        return res.redirect('/administrativo')

                        passport.authenticate('local', {
                            successRedirect: '/administrativo/',
                            failureRedirect: '/usuario/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    else {
                        // res.send('Usuario ou senha invalida')

                        /* await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/user/login',
                            failureRedirect: '/user/login',
                            failureFlash: true
                            })(req, res, next) */
                    }
                }

            }
            /* const rel = await createRelUserService(relUsuarios) */

        }
    } catch (error) {
       return res.status(500).send({ mesage: error.mesage })
    }
}

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.clearCookie('access_token');
        req.flash('success_msg', 'Sua sessão foi encerrada!')
        res.redirect('/')

    })
}

export const wAddUser = (req, res) => {
    res.render('admin/addUser')
}

export const addUser = async (req, res) => {
    let { id, numero, nome, email, telefone, senha, senha2, categoria, genero, nivelAcademico, area, cursos } = req.body
    const username = email

    try {
        if (categoria === '') {
            categoria = 'Formando'
        }
        const users = await findAllUsers()
        numero = users.length + 1
        const verifyUser = await findByUsernameService(username)
        //return res.send({verifyUser})
        if (verifyUser) {
            req.flash('error_msg', 'Nome de usuário já existente!')
            return res.redirect('/usuario/add')
        } else {
            const novoUsuario = {
                idUser: id,
                numero: numero,
                nome: nome,
                username: username,
                senha: senha,
                telefone: telefone,
                categoria: categoria,
                area: area,
                cursos: cursos,
                genero: genero,
                nivelAcademico: nivelAcademico
            }
            //return res.send("Testando...")

            //return res.send({novoUsuario})
            switch (categoria) {
                case "admin":
                    novoUsuario.eAdmin = 1
                    break;

                case "secretario":
                    novoUsuario.eAdmin = 2
                    break;

                case "pedagogico":
                    novoUsuario.eAdmin = 3
                    break;

                case "financeiro":
                    novoUsuario.eAdmin = 4
                    break;

                default:
                    break;
            }

            console.log(novoUsuario)
            await createUserService(novoUsuario);
            req.flash('success_msg', 'Usuário cadastrado com sucesso!')
            res.redirect('/usuario/todos')
        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
/* 
// Cadastro com imagem
export const addUser = async (req, res) => {
    let { id, numero, nome, email, telefone, senha, senha2, categoria, genero, nivelAcademico, area, cursos } = req.body
    const username = email

    try {
        if (req.file) {
            if (categoria === '') {
                categoria = 'Formando'
            }
            const users = await findAllUsers()
            numero = users.length + 1
            const verifyUser = await findByUsernameService(username)
            if (verifyUser) {
                req.flash('error_msg', 'Nome de usuário já existente!')
                res.redirect('/user/add')
            } else {
                const novoUsuario = {
                    idUser: id,
                    numero: numero,
                    nome: nome,
                    username: username,
                    senha: senha,
                    telefone: telefone,
                    categoria: categoria,
                    foto: req.file.filename,
                    area: area,
                    cursos: cursos,
                    genero: genero,
                    nivelAcademico: nivelAcademico
                }
                //return res.send("Testando...")

                //return res.send({novoUsuario})
                switch (categoria) {
                    case "admin":
                        novoUsuario.eAdmin = 1
                        break;

                    case "secretario":
                        novoUsuario.eAdmin = 2
                        break;

                    case "pedagogico":
                        novoUsuario.eAdmin = 3
                        break;

                    case "financeiro":
                        novoUsuario.eAdmin = 4
                        break;

                    default:
                        break;
                }

                console.log(novoUsuario)
                await createUserService(novoUsuario);
                req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                res.redirect('/usuario/todos')
            }

        } else {

            return res.send('Falha ao carregar foto')
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
} */

export const deletUser = async (req, res) => {
    try {
        const id = req.params.id
        const usuario = await findUserByIdAndDelet(id)
        if (!usuario) {
            req.flash('error_msg', 'Voce está tentar apagar usuário não existente')
            res.redirect('/user/allUsers')
        } else {
            req.flash('error_msg', 'Usuário xcluido com sucesso')
            res.redirect('/usuario/todos')
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const wEditUser = async (req, res) => {
    try {
        const id = req.params.id
        const usuario = await findUserByIdService(id)
        //return res.send("Testando...")
        if (!usuario) {
            req.flash('error_msg', 'Voce está tentar actualizar usuário não existente')
            res.redirect('/usuario/allUsers')
        } else {
            res.render('admin/usuario/editUser', { usuario })
        }
    } catch (error) {
        res.status(500).send({ msg: error.mesage })
    }
}

export const editUser = async (req, res) => {
    try {
        //return res.send("Testando...")
        const { id, novaSenha, novaSenha2 } = req.body
        const username = req.body.username
        const telefone = req.body.telefone
        if (username == '' || username.length < 2) {
            req.flash('error_msg', 'Nome de usuário invalido')
            res.redirect('/usuario/editUser/' + id)
        } else {
            if (novaSenha != novaSenha2 || novaSenha == "") { return res.send("As senhas não são iguais") }
            const usuario = await findUserByIdService(id)
            if (!usuario) {
                req.flash('error_msg', 'Este usuário não existe!')
                res.redirect('/usuario/allUsers')
            } else {
                usuario.username = username
                usuario.telefone = telefone
                usuario.senha = novaSenha
                await findUserBIdAndUpdate(id, usuario);
                //return res.send({usuario, novoUsuario})
                req.flash('success_msg', 'Dados do usuário alterado com sucesso!')
                res.redirect('/usuario/todos')

            }
        }
    } catch (error) {
        res.status(500).send({ mesag: error.mesage })
    }
}

export const perfil = async (req, res) => {
    try {
        const userLog = req.user
        if (userLog == "" || userLog == null) { return res.redirect("/usuario/login") }
        const username = userLog.username;
        const user = await findUserByUsername(username)
        //return res.send({ user })
        const id = user._id

        if (user == '' || user == null) {
            return res.send('Usuario não achado!')

        } else {
            //return res.send('Usuario existente')
            if (user.eAdmin == 1) {
                //return res.send('Usuario Admin')

                res.redirect('/admin/' + id)

            } else {
                if (user.categoria == 'Professor') {
                    res.redirect('/professor/' + id)
                } else {

                    if (user.categoria == 'formando') {
                        const formando = await findUserByIdService(id)
                        const idFormando = formando._id
                        //return res.send({formando})
                        res.redirect('/formando/ficha/' + idFormando)
                    }
                    if (user.categoria == 'pedagogico') {
                        res.redirect('/pedagogico/')
                    }
                    if (user.categoria == 'administrativo') {
                        res.redirect('/administrativo/')
                    }
                    if (user.categoria == 'secretario') {
                        res.redirect('/administrativo/')
                    }
                }
                /*  else {
                    await authMidleware(passport)
                    passport.authenticate('local', {
                        successRedirect: '/inicio',
                        failureRedirect: '/user/login',
                        failureFlash: true
                    })(req, res, next)
                } */

            }


        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const perfilUser = async (req, res) => {
    try {
        const userLog = req.user
        if (userLog == "" || userLog == null) { return res.redirect("/usuario/login") }
        const username = userLog.username;
        const user = await findUserByUsername(username)
        //return res.send({ user })
        const id = user._id

        if (user == '' || user == null) {
            return res.send('Usuario não achado!')

        } else {
            res.render("admin/usuario/perfilUser", { user })


        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editPerfilUser = async (req, res) => {
    try {
        const { idUser, nome, numBI, telefone } = req.body
        let usuario = await findUserByIdService(idUser)
        usuario.nome = nome
        usuario.numBI = numBI
        usuario.telefone = telefone

        const veryUser = await findUserByNumBIService(numBI)
        if (veryUser && veryUser._id != "" + usuario._id) {
            req.flash("error_msg", "ERRO! O número de Bilhete inserido pertence a outro Usuário!")
            return res.redirect("/usuario/perfilUser")

        }

        await findUserBIdAndUpdate(idUser, usuario)
        req.flash("success_msg", "Dados alterados com sucesso!")
        res.redirect("/usuario/perfilUser")

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editOutInformacoes = async (req, res) => {
    try {
        const { idUser, area, cursos } = req.body
        let usuario = await findUserByIdService(idUser)
        usuario.area = area
        usuario.cursos = cursos
        await findUserBIdAndUpdate(idUser, usuario)

        req.flash("success_msg", "Dados alterados com sucesso!")
        res.redirect("/usuario/perfilUser")

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editarSenha = async (req, res, next) => {
    try {
        const { idUser, senha, senha2 } = req.body
        let usuario = await findUserByIdService(idUser)
        if (senha != senha2) {
            req.flash("error_msg", "ERRO! As senhas não são iguais. Repete por favor.")
            return res.redirect("/usuario/perfilUser")

        }
        usuario.senha = await bcrypt.hash(senha, 10)
        await findUserBIdAndUpdate(idUser, usuario)

        req.flash("success_msg", "Dados alterados com sucesso!")
        res.redirect("/usuario/perfilUser")

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const createNewUserAluno = async (req, res) => {
    try {
        //CRIAR USUÁRIO
        const idAluno = req.params.id
        const aluno = await findAlunoByIdService(idAluno)
        const turma = await findTurmaByIdService(aluno.idTurma)
        const nomeArray = aluno.nome.split(" ")
        const username0 = nomeArray[0] + '@ndunduma' + turma.codigo + '.' + nomeArray[1]
        const username = username0.toLocaleLowerCase()
        const senha = turma.codigo + '-' + nomeArray[1]

        const novoUsuario = {
            username: username,
            senha: senha,
            categoria: 'aluno',
            telefone: ''
        }

        const veryUser = await findByUsernameService(username)
        if (veryUser) {
            //return res.send('Não foi possível adicionar aluno. Já ha um usuário com este nome!')
            req.flash('error_msg', 'Não foi possível adicionar aluno. Nome de usuário já existente! (Ao criar conta do aluno)')
            res.redirect('/turmas/turma/' + idTurma)
        } else {

            const userAluno = await createUserService(novoUsuario)
            aluno.usuario = userAluno._id;
            await findAlunoByIdAndUpdate(aluno._id, aluno)
            //return res.send('Sucesso!')

            req.flash('success_msg', 'Novo usuario criado com sucesso!')
            res.redirect('/turmas/usuariosTurma/' + turma._id)
        }

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const cadastrarse = async (req, res) => {
    try {
        //CRIAR USUÁRIO
        const { formandoNoCentro, idCurso } = req.body
        const curso = await findCursoByIDService(idCurso)
        const candidato = true
        const formandos = await findAllFormandosService()
        let cursos = await findAllCursosService()
        const numero = "INEFOP" + formandos.length + 1
        const id = (numero * 3) - 1
        const data = new Date().getFullYear()
        const idString = id + "-Fd" + data

        /* Verificar vagas em cada curso */
        let vagasDisponiveis = false
        cursos.forEach(curso => {
            if (curso.vagas > 0) { curso.disponivel = true; vagasDisponiveis = true }
        });
        if (formandoNoCentro == "não") {
            
            return res.render("formando/novoFormando", { idString, numero, cursos, candidato, curso, vagasDisponiveis })
        }

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}