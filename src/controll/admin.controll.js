import ejs from 'ejs'
import path from 'path'
import pdf from 'html-pdf'
//import puppeteer from 'puppeteer'

import aluno from "../models/aluno.modell.js"
import { createAlunoService, findAlunoAnDeleteSercice, findAlunoByBIService, findAlunoByIdAndUpdate, findAlunoByIdService, findAlunosByIdTurma } from "../services/alunos.servece.js"
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { findAllFuncionariosService, findFuncionariosByIdService } from "../services/funcionario.service.js"
import { createNotasDisciplinaService, findNotaDisciplinaByIdAndDeleteService, findNotaDisciplinaByIdService, findNotasDisciplinaByIdAluno, findNotasDisciplinaByIdAlunoAndDelete, findNotasDisciplinaByIdMinipautaService } from "../services/notasDisciplina.service.js"
import { findTurmaByIdAndDeleteSerice, findTurmaByIdAndUpdService, findTurmaByIdCursoService, findTurmaByIdService } from "../services/turma.service.js"
import { createUserService, findAllUsers, findByUsernameService, findUserByIdAndDelet, findUserByIdService } from "../services/user.service.js"
import { createNotaTrimestral, findNotaByIdAndUpdateSerice, findNotasExistentByIdService } from '../services/notas.service.js'
import { calcularMedias } from '../middlewares/professor.middlewere.js'
import { findMiniPautaByIdAndDelete, findMinipautaByIdAndUpdateService, findMinipautaByIdService } from '../services/minipauta.service.js'
import { findClasseByIdService } from '../services/classe.service.js'
import { findAllVisitasServece } from '../services/visitantes.servece.js'

export const admin = async (req, res) => {
    try {
        const id = req.params.id
        const user = await findUserByIdService(id)
        let visitantes = await findAllVisitasServece()
        
        res.render('admin/admin', { user, visitantes })
        //return res.send({user})
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editarFoto = async (req, res) => {
    try {
        res.send('Testar rota editar foto...')
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const addAluno = async (req, res) => {
    try {
        //return res.send("Sucesso!")
        const idTurma = req.body.idTurma
        const numBI = req.body.numBI
        const classe = req.body.classe
        const nome = req.body.nome
        const curso = req.body.curso
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso

        const turma = await findTurmaByIdService(idTurma)
        const anoActivo = await findAnoLectivoByEstadoService('Activo')
        const idAno = anoActivo._id

        //CRIAR USUÁRIO
        const nomeArray = nome.split(" ")
        const username0 = nomeArray[0] + '@al' + turma.codigo + '.' + nomeArray[1]
        const username = username0.toLocaleLowerCase()
        const senha = turma.codigo + '-' + nomeArray[1]

        //return res.send({senha})
        const novoUsuario = {
            username: username,
            senha: senha,
            categoria: 'aluno',
            telefone: ''
        }


        const aluno = {
            nome: nome,
            numBI: numBI,
            idTurma: idTurma,
            classe: classe,
            curso: curso,
            idClasse: idClasse,
            idCurso: idCurso,
            idAno: idAno,
            genero: 'Não definido',
            pai: 'Não definido',
            mae: 'Não definido',
            escolaAnt: 'Não definido',
            morada: 'Não definido',
            nomeEncarregado: 'Não definido',
            matricula: 'Confirmada',
        }
        const veryUser = await findByUsernameService(username)
        if (veryUser) {
            //return res.send('Não foi possível adicionar aluno. Já ha um usuário com este nome!')
            req.flash('error_msg', 'Não foi possível adicionar aluno. Nome de usuário já existente! (Ao criar conta do aluno)')
            res.redirect('/turmas/turma/' + idTurma)
        } else {

            const userAluno = await createUserService(novoUsuario)
            aluno.usuario = userAluno._id;
            await createAlunoService(aluno)
            //return res.send('Sucesso!')

            req.flash('success_msg', 'Aluno adicionado com sucesso!')
            res.redirect('/turmas/turma/' + idTurma)
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}


export const atribGenero = async (req, res) => {
    try {
        const { idTurma, generos } = req.body
        const alunos = await findAlunosByIdTurma(idTurma)

        let alunosSemGenero = []
        alunos.forEach(aluno => {
            if (aluno.genero === undefined || aluno.genero == 'Não definido' || aluno.genero == 'Não definido' || aluno.genero == null) {
                alunosSemGenero.push(aluno)
            }
        });

        let index = 0
        let alunosActulizados = []
        alunosSemGenero.forEach(aluno => {
            let g = generos[index]
            if (g == 'selecionar') {
                g = ''
            }
            aluno.genero = g
            alunosActulizados.push(aluno)
            index += 1
        });
        alunosActulizados.forEach(async aluno => {
            await findAlunoByIdAndUpdate(aluno._id, aluno)
        });

        req.flash('success_msg', 'Operação realizada com sucesso!')
        res.redirect('/turmas/turma/' + idTurma)


    } catch (error) {
        return res.status(500).send({ mesage: error.mensage })
    }
}

export const apagarAluno = async (req, res) => {

    try {
        const idAluno = req.params.id
        const aluno = await findAlunoByIdService(idAluno)
        //return res.send({aluno})
        res.render('admin/apagarAluno', { aluno })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const apagarAluno2 = async (req, res) => {

    try {
        const idAluno = req.body.idAluno
        const aluno = await findAlunoByIdService(idAluno)
        const usuario = await findUserByIdService(aluno.usuario)
        const idTurma = aluno.idTurma
        //const notasDisciplina = await findNotasDisciplinaByIdAluno(idAluno)
        await findNotasDisciplinaByIdAlunoAndDelete(idAluno)
        //return res.send({notasDisciplina})
        await findUserByIdAndDelet(aluno.usuario)
        await findAlunoAnDeleteSercice(idAluno)
        req.flash('error_msg', 'Dados do aluno apagado com sucesso')
        res.redirect('/turmas/turma/' + idTurma)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarMiniPauta = async (req, res) => {

    try {

        const idMinipauta = req.params.id
        const minipauta = await findMinipautaByIdService(idMinipauta)
        const idProfessor = minipauta.idProfessor
        const professor = await findFuncionariosByIdService(idProfessor)
        res.render('admin/eliminarMiniPauta', { professor, minipauta })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const edidarMiniPauta = async (req, res) => {

    try {

        const idMinipauta = req.params.id
        const minipauta = await findMinipautaByIdService(idMinipauta)
        const idProfessor = minipauta.idProfessor
        const professor = await findFuncionariosByIdService(idProfessor)
        res.render('admin/editarMiniPauta', { professor, minipauta })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarMiniPauta2 = async (req, res) => {

    try {

        const { idMinipauta, idProfessor, idTurma, nomeDisciplina } = req.body

        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)

        notasDisciplina.forEach(async notaD => {
            //console.log({notaD})
            await findNotaDisciplinaByIdAndDeleteService(notaD._id)
        });

        //return res.send({notasDisciplina})
        //para remover o professor da turma e retiralo a minipauta
        const result = await deleteTurmaProfService(idProfessor, idTurma, idMinipauta, nomeDisciplina)
        await findMiniPautaByIdAndDelete(idMinipauta)

        req.flash('error_msg', 'Minipauta eliminada com exito!')
        res.redirect('/professor/minipautasCadPAdmin/' + idProfessor)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editarMiniPauta2 = async (req, res) => {

    try {
        const { idMinipauta, idProfessor, idTurma, nomeDisciplina } = req.body
        let minipauta = await findMinipautaByIdService(idMinipauta)
        minipauta.nomeDisciplina = nomeDisciplina
        await findMinipautaByIdAndUpdateService(idMinipauta, minipauta)
        // return res.send({ minipauta })

        req.flash('success_msg', 'Minipauta editada com exito!')
        res.redirect('/professor/minipautasCadPAdmin/' + idProfessor)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarNotasDisciplina = async (req, res) => {

    try {
        const idNotasD = req.params.id

        const notasD = await findNotaDisciplinaByIdService(idNotasD)
        const idMinipauta = notasD.idMinipauta
        const idTurma = notasD.idTurma
        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)
        //return res.send({notasD})

        notasDisciplina.forEach(async notaD => {
            //console.log({notaD})
            await findNotaDisciplinaByIdAndDeleteService(notaD._id)
        });

        await findNotaDisciplinaByIdAndDeleteService(idNotasD)
        req.flash('error_msg', 'Foram eliminadas as notas falsas nas ficha dos alunos desta turma!')
        res.redirect('/turmas/turma/' + idTurma)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarTurma = async (req, res) => {
    try {
        const idTurma = req.body.idTurma

        await findTurmaByIdAndDeleteSerice(idTurma)

        req.flash('error_msg', 'Turma eliminada com exito!')
        res.redirect('/pedagogico/turmas')
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const editarTurma = async (req, res) => {
    try {
        const turma = req.body
        const turmas = await findTurmaByIdCursoService(turma.idCurso)

        let verTurma = ''
        turmas.forEach(t => {
            if (t.codigo == turma.codigo) {
                verTurma = 'Neste curso, já existe uma turma com este código!'
            }
        });


        if (verTurma) {
            //return res.send(verTurma)
            req.flash('error_msg', verTurma)
            res.redirect('/pedagogico/turmas')

        } else {
            //return res.send('Pode alterar...')
            const idTurma = req.body.idTurma
            const turmaAActualizar = await findTurmaByIdService(idTurma)
            turmaAActualizar.codigo = req.body.codigo
            //return res.send('Sucesso!')

            await findTurmaByIdAndUpdService(idTurma, turmaAActualizar)

            req.flash('success_msg', 'Código da Turma alterado com exito!')
            res.redirect('/pedagogico/turmas')
        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const listaUserPDF = async (req, res) => {
    try {
        let usuarios = await findAllUsers()
        let funcionarios = await findAllFuncionariosService()

        funcionarios.forEach(funcionario => {
            usuarios.forEach(usuario => {
                if (funcionario.usuario == '' + usuario._id) {
                    funcionario.usuario = usuario.username
                }
            });
        });

        const date = new Date();
        const diaR = date
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        //let ano = date.getFullYear();
        //GERANDO PDF com html-pdf
        ejs.renderFile("./views/admin/listaUserPDF.ejs", { dia: dia, mes: mes, ano: ano, funcionarios }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {

                const options = {
                    format: "A4",
                    orientation: 'portrait',
                    header: {
                        height: "15mm"
                    },
                    footer: {
                        height: "20mm"
                    }

                }
                pdf.create(html, options).toFile("./relatorios/usuarios/listaUserFunc.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu ao guradar lista')
                    } else {
                        req.flash('success_msg', 'Lista de usuarios gerado com sucesso! veja na pasta de relatórios em C:/')
                        res.redirect('/user/allUsers')
                    }
                })
            }
        })


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const relUserSistema = async (req, res) => {
    try {
        let relUsuarios = await findAllRelUserService()
        const date = new Date();
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        let diaAntes = parseInt(dia) - 1

        let numVisualiz = 0
        relUsuarios.forEach(relatorio => {
            if (relatorio.diaDeAcesso == dia && relatorio.mesDeAcesso == mes && relatorio.anoDeAcesso == ano) {
                relatorio.hoje = 'Hoje'
            }
            if (relatorio.diaDeAcesso == '' + diaAntes && relatorio.mesDeAcesso == mes && relatorio.anoDeAcesso == ano) {
                relatorio.hoje = 'Ontem'
            }
            numVisualiz++
        });
        relUsuarios.forEach(rel => {
            rel.numVisualiz = numVisualiz
            numVisualiz--
        });
        /* Pesquisar visitantes */
        const visitantes = await findAllVisitantesServece()
        res.render('admin/relUserSistema', { relUsuarios, visitantes })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editarNotaMinipauta = async (req, res) => {
    try {
        const idAluno = req.body.aluno
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idMinipauta
        const idClasse = req.body.idClasse
        const idTurma = req.body.idTurma

        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe
        const notaString = req.body.nota
        let nota = parseInt(notaString)
        //return res.send({trimeste, notaDe, idAluno})
        const ms = 'Só deve inserir nota no intervalo de 0 à 20 \nVolte e tente novamente!'
        if (nota > 20 || nota < 0) { const msdDeErro = ms; return res.render('msgError', { msdDeErro }) }
        if (idAluno == "selecionar" || trimeste == "selecionar" || notaDe == "selecionar") {
            const msdDeErro = 'Volte e verifique se selecionou correctamente o Aluno, Trimestre e a Nota de.'
            return res.render('msgError', { msdDeErro })
        } else {

            const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)
            const notasDoAluno = await findNotasDisciplinaByIdAluno(idAluno)
            let verifNota = ''
            let notasAchada = ''
            notasDoAluno.forEach(element => {
                if (element.idMinipauta == idMinipauta) {
                    verifNota = 'Ja'
                    notasAchada = element.notas
                }
            });

            //const verNotasTrim = await findAllNotasTrimSercice()
            if (verifNota == '') {
                //return res.send("O aluno ainda não tem notas nesta discplina")
                let novaNotasDoaluno = {
                    aluno: idAluno,
                    professor: idProfessor,
                    idMinipauta: idMinipauta,
                    idClasse: idClasse,
                    idTurma: idTurma
                }

                let notaTrimestral = {}
                if (trimeste == 'primeiro') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no primeiro trimestre - av1")
                            notaTrimestral.av1T1 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no primeiro trimestre - av2")
                            notaTrimestral.av2T1 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notaTrimestral.av3T1 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notaTrimestral.pp1 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notaTrimestral.pt1 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')
                            break;
                    }
                }


                if (trimeste == 'segundo') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no segungo trimestre - av1")
                            notaTrimestral.av1T2 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no segungo trimestre - av2")
                            notaTrimestral.av2T2 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notaTrimestral.av3T2 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notaTrimestral.pp2 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notaTrimestral.pt2 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }
                if (trimeste == 'terceiro') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no terceiro trimestre - av1")
                            notaTrimestral.av1T3 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no terceiro trimestre - av2")
                            notaTrimestral.av2T3 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notaTrimestral.av3T3 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notaTrimestral.pp3 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notaTrimestral.pt3 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }
                if (trimeste == 'outro') {
                    switch (notaDe) {
                        case "provaOral":
                            //return res.send("Lançar nota de prova oral, final ou exame")
                            notaTrimestral.pOral = nota
                            break;
                        case "exame":
                            // return res.send("Lançar nota de prova oral, final ou exame")
                            notaTrimestral.examePF = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }

                const notasTrimCread = await createNotaTrimestral(notaTrimestral)
                novaNotasDoaluno.notas = notasTrimCread._id
                const notasDoAlunoCriada = await createNotasDisciplinaService(novaNotasDoaluno)
                req.flash('success_msg', 'Nota lançada com exito!')
                res.redirect("/professor/minipauta/" + idMinipauta)
            } else {

                const idNotaAch = notasAchada._id
                const notasExist = await findNotasExistentByIdService(idNotaAch)
                //return res.send('SSS 4')
                if (notasExist) {
                    //return res.send('Actualizar as notas do auno!')
                    if (trimeste == 'primeiro') {
                        switch (notaDe) {
                            case "avaliacao1":
                                //return res.send("Lançar nota no primeiro trimestre - av1")
                                notasExist.av1T1 = nota
                                break;
                            case "avaliacao2":
                                // return res.send("Lançar nota no primeiro trimestre - av2")
                                notasExist.av2T1 = nota

                                break;
                            case "avaliacao3":
                                //   return res.send("Lançar nota no primeiro trimestre - av3")
                                notasExist.av3T1 = nota

                                break;
                            case "provaDoProfessor":
                                //   return res.send("Lançar nota no primeiro trimestre - av3")
                                notasExist.pp1 = nota

                                break;
                            case "provaDoTrimestre":
                                //   return res.send("Lançar nota no primeiro trimestre - av3")
                                notasExist.pt1 = nota

                                break;

                            default:
                                return res.send('Selecione os campos correctamente!')
                                break;
                        }
                    }
                    if (trimeste == 'segundo') {
                        switch (notaDe) {
                            case "avaliacao1":
                                //return res.send("Lançar nota no segungo trimestre - av1")
                                notasExist.av1T2 = nota
                                break;
                            case "avaliacao2":
                                // return res.send("Lançar nota no segungo trimestre - av2")
                                notasExist.av2T2 = nota

                                break;
                            case "avaliacao3":
                                //   return res.send("Lançar nota no segungo trimestre - av3")
                                notasExist.av3T2 = nota

                                break;
                            case "provaDoProfessor":
                                //   return res.send("Lançar nota no segungo trimestre - av3")
                                notasExist.pp2 = nota

                                break;
                            case "provaDoTrimestre":
                                //   return res.send("Lançar nota no segungo trimestre - av3")
                                notasExist.pt2 = nota

                                break;

                            default:
                                return res.send('Selecione os campos correctamente!')

                                break;
                        }
                    }
                    if (trimeste == 'terceiro') {
                        switch (notaDe) {
                            case "avaliacao1":
                                //return res.send("Lançar nota no terceiro trimestre - av1")
                                notasExist.av1T3 = nota
                                break;
                            case "avaliacao2":
                                // return res.send("Lançar nota no terceiro trimestre - av2")
                                notasExist.av2T3 = nota

                                break;
                            case "avaliacao3":
                                //   return res.send("Lançar nota no terceiro trimestre - av3")
                                notasExist.av3T3 = nota

                                break;
                            case "provaDoProfessor":
                                //   return res.send("Lançar nota no terceiro trimestre - av3")
                                notasExist.pp3 = nota

                                break;
                            case "provaDoTrimestre":
                                //   return res.send("Lançar nota no terceiro trimestre - av3")
                                notasExist.pt3 = nota

                                break;

                            default:
                                return res.send('Selecione os campos correctamente!')

                                break;
                        }
                    }
                    if (trimeste == 'outro') {
                        switch (notaDe) {
                            case "provaOral":
                                //return res.send("Lançar nota de prova oral, final ou exame")
                                notasExist.pOral = nota
                                break;
                            case "exame":
                                // return res.send("Lançar nota de prova oral, final ou exame")
                                notasExist.examePF = nota

                                break;

                            default:
                                return res.send('Selecione os campos correctamente!')

                                break;
                        }
                    }

                    //CÁLCULOS DAS MÉDIAS - MAC MT1, MT2, MT3, MT, CF


                    //return res.send('Actualozação das notas do aluno')
                    const notasUpdate = await findNotaByIdAndUpdateSerice(idNotaAch, notasExist)
                    const mediasActulizadas = await calcularMedias(idNotaAch)
                    // return res.send({mediasActulizadas})
                    req.flash('success_msg', 'Nota lançada com exito!')
                    res.redirect("/professor/minipauta/" + idMinipauta)
                } else {
                    return res.send('As notas do aluno foram apagadas do sistea')

                }
            }
        }

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const backup = async (req, res) => {
    try {
        res.render("admin/backup")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const confirmarMatricula = async (req, res) => {
    try {
        const { idTurma, numBI, confirmado, novaClasse } = req.body

        let turma = await findTurmaByIdService(idTurma)
        let alunos = await findAlunosByIdTurma(idTurma)
        let classe = await findClasseByIdService(turma.idClasse)
        classe = classe.designacao
        let idAnoAct = await findAnoLectivoByEstadoService("Activo")
        let indexConfirmado = 0
        let indexNumBI = 0
        let alunosParaActualizar = []
        let reconfirmou = false
        let selectConfirmado = false
        confirmado.forEach(item => {
            if (item != "") { selectConfirmado = true }
        });
        
        if (idAnoAct) {
            idAnoAct = idAnoAct._id
        }else{
            const msdDeErro = 'Não ha nunhum ano Lectivo Activo. Cria o novo ano Lectivo!'
            return res.render('msgError', { msdDeErro })
        }
        if (novaClasse == "") {
            const msdDeErro = 'Seleciona a nova Classe e Turma'
            return res.render('msgError', { msdDeErro })
        }
        if (!selectConfirmado) { 
            const msdDeErro = 'Seleciona os alunos que reconfirmaram a Maricula'
            return res.render('msgError', { msdDeErro })
        }

        if (novaClasse == "Concluido" & classe == "12ª Classe") {
            reconfirmou = true
            alunos.forEach(aluno => {
                if (confirmado[indexConfirmado] == "Confirmado") {

                    aluno.numBI = numBI[indexNumBI]
                    aluno.classe = novaClasse
                    aluno.concluido = "Concluido"
                    aluno.idTurma = ""
                    aluno.matricula = "Confirmada"
                    alunosParaActualizar.push(aluno)
                }

                indexNumBI++
                indexConfirmado++
            });
            turma.reconfirmaAprovados = true
            await findTurmaByIdAndUpdService(idTurma, turma)
        } else {
            const idNovaCT = novaClasse
            const novaTurma = await findTurmaByIdService(idNovaCT)
            const novaClasse2 = await findClasseByIdService(novaTurma.idClasse)
            if (classe == "11ª Classe" & (novaClasse2.designacao == "11ª Classe" || novaClasse2.designacao == "12ª Classe")) {
                reconfirmou = true

                alunos.forEach(aluno => {
                    if (confirmado[indexConfirmado] == "Confirmado") {

                        aluno.numBI = numBI[indexNumBI]
                        aluno.classe = novaClasse2.designacao
                        aluno.idTurma = novaTurma._id
                        aluno.matriculado = true
                        aluno.matricula = "Confirmada"
                        aluno.idAno = idAnoAct
                        alunosParaActualizar.push(aluno)
                    }

                    indexNumBI++
                    indexConfirmado++
                });
                turma.reconfirmaAprovados = true
                await findTurmaByIdAndUpdService(idTurma, turma)
            }
            if (classe == "12ª Classe" & novaClasse2.designacao == "12ª Classe") {
                reconfirmou = true

                alunos.forEach(aluno => {
                    if (confirmado[indexConfirmado] == "Confirmado") {

                        aluno.numBI = numBI[indexNumBI]
                        aluno.classe = novaClasse2.designacao
                        aluno.idTurma = novaTurma._id
                        aluno.matriculado = true
                        aluno.matricula = "Confirmada"
                        aluno.idAno = idAnoAct
                        alunosParaActualizar.push(aluno)
                    }

                    indexNumBI++
                    indexConfirmado++
                });
                turma.reconfirmaAprovados = true
                await findTurmaByIdAndUpdService(idTurma, turma)
            }
            if (classe == "10ª Classe" & (novaClasse2.designacao == "10ª Classe" || novaClasse2.designacao == "11ª Classe")) {
                reconfirmou = true

                alunos.forEach(aluno => {
                    if (confirmado[indexConfirmado] == "Confirmado") {

                        aluno.numBI = numBI[indexNumBI]
                        aluno.classe = novaClasse2.designacao
                        aluno.idTurma = novaTurma._id
                        aluno.matricula = "Confirmada"
                        aluno.matriculado = true
                        aluno.idAno = idAnoAct
                        alunosParaActualizar.push(aluno)
                    }

                    indexNumBI++
                    indexConfirmado++
                });
                turma.reconfirmaAprovados = true
                await findTurmaByIdAndUpdService(idTurma, turma)
            }
        }



        if (!reconfirmou) { 
            const msdDeErro = 'Define os dados da reconfirmação correctamente!'
            return res.render('msgError', { msdDeErro })
        }


        //return res.send({ alunosParaActualizar })
        alunosParaActualizar.forEach(async aluno => {
            await findAlunoByIdAndUpdate(aluno._id, aluno)
        });



        req.flash('success_msg', 'Operação realizada com sucesso!')
        res.redirect('/turmas/turma/' + idTurma)


    } catch (error) {
        return res.status(500).send({ mesage: error.mensage })
    }
}

