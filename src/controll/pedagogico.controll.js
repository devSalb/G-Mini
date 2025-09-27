import fs from 'fs'
import pdf from 'html-pdf'
import ejs from 'ejs'

import { cadastrarCurso, findCursoByIDService, findCursoByNomeService, findCursoByIdAndUpdateDServece, findCursoAndDeleteServece } from "../services/curso.service.js"
import { createFormandoService, findAllFormandosService, findAlunosByIdTurma, findFormandoAndUpdateServece, findFormandoByIdAndDelete, findFormandoByIdServise, findFormandoByUser, findFormandosByIdCurso, findFormandosByIDTurmaService, findFormandosInscritosServece } from "../services/alunos.servece.js"
import { findAllFormadoresServoce, findFuncionarioByIdAndUpdateService, findFuncionariosByIdService } from "../services/funcionario.service.js"
import { creatMinipautaService, findAllMinipautasService, findAllMinipautasServiceGeral } from "../services/minipauta.service.js"
import { createModulo, findModulosByIdCursoSercice } from "../services/modulos.servoce.js"
import { createTurmaService, findAllTurmasService, findTurmaByIdAndDeleteSerice, findTurmaByIdCursoService, findTurmaByIdService, findTurmaByNomeTurma } from "../services/turma.service.js"
import { createUserService, findUserByIdAndDelet } from "../services/usuario.service.js"


export const homePedagogica = async (req, res) => {
    try {
        res.render("pedagogico/homePedagogica")
    } catch (error) {
        return res.satus(500).send({ mesase: mesage.error })
    }
}

/* GESTÃO DE CURSOS */
export const minipautas = async (req, res) => {
    try {
        let autorizado = false
        const userLog = req.user
        if (userLog) {
            if (userLog.categoria == "secretario" || userLog.categoria == "admin") { autorizado = true }
        }
        let minipautas = await findAllMinipautasServiceGeral()
        let numOrdem = 1
        minipautas.forEach(async minipauta => {
            const alunos = await findAlunosByIdTurma(minipauta._id)
            minipauta.alunos = alunos
            minipauta.numOrdem = numOrdem
            numOrdem++
        });
        //return res.send({minipautas})
        res.render("pedagogico/minipautas", { minipautas, autorizado })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const curso = async (req, res) => {
    try {
        let autorizado = false
        const userLog = req.user
        if (userLog) {
            if (userLog.categoria == "secretario" || userLog.categoria == "admin") { autorizado = true }
        }
        const idCurso = req.params.id
        const curso = await findCursoByIDService(idCurso)
        let turmas = await findTurmaByIdCursoService(curso._id)
        const modulos = await findModulosByIdCursoSercice(curso._id)

        /* Contar matriculados em cada turma */
        turmas.forEach(async turma => {
            let matriculados = await findFormandosByIDTurmaService(turma._id)
            turma.matriculados = matriculados.length
        });

        //return res.send({curso})
        res.render("cursos/curso", { curso, turmas, modulos, autorizado })
    } catch (error) {
        return res.satus(500).send({ mesase: mesage.error })
    }
}

export const novoCursoW = async (req, res) => {
    try {
        const cursos = await findAllMinipautasService()()
        //return res.send({cursos})
        const codCurso = "INEFOp-C025-0" + (cursos.length + 1)
        res.render("pedagogico/novoCurso", { codCurso })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const novoCursoSave = async (req, res) => {
    try {
        const curso = req.body
        const verifyCurso = await findCursoByNomeService(curso.nomeCurso)
        if (!verifyCurso) {
            await cadastrarCurso(curso)
            req.flash("success_msg", "Curso cadastrado com sucesso!")
            return res.redirect("/pedagogico/cursos")
        } else {
            const curso = req.body
            const mesageErr = []
            mesageErr.push({ texto: "Erro! O Curso que está tentar cadastrar já existe." })
            const cursos = await findAllMinipautasService()()
            const codCurso = "INEFOp-C025-0" + (cursos.length + 1)
            return res.render("pedagogico/novoCurso", { curso, mesageErr, codCurso })

        }
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const cursosPublic = async (req, res) => {
    try {
        let cursos = await findAllMinipautasService()()
        let informatica = true
        cursos.forEach(curso => {
            if (curso.nomeCurso == "Informática na Ótica do Utilizador") { curso.imagem = "informatica.jpeg"; curso.informatica = informatica }
        });

        let vagasDisponiveis = false
        cursos.forEach(curso => {
            if (curso.vagas > 0) { curso.disponivel = true; vagasDisponiveis = true }
        });

        return res.render("cursos/cursosPublic", { cursos, vagasDisponiveis })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editCurso = async (req, res) => {
    try {
        let { idCurso, nomeCurso, familia } = req.body
        const verifyCurso = await findCursoByNomeService(nomeCurso)
        if (verifyCurso) {
            if (verifyCurso._id != "" + idCurso) {
                req.flash("error_msg", "Erro! Já existe um curso com este nome de " + nomeCurso)
                return res.redirect("/pedagogico/curso/" + idCurso)
            }
        }
        let curso = await findCursoByIDService(idCurso)
        curso.nomeCurso = nomeCurso
        curso.familia = familia
        await findCursoByIdAndUpdateDServece(idCurso, curso)

        req.flash("success_msg", "Dados alterado co sucesso!")
        return res.redirect("/pedagogico/curso/" + idCurso)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const deleteCurso = async (req, res) => {
    try {
        let { idCurso, nomeCurso } = req.body
        let formandosDoCurso = await findFormandosByIdCurso(idCurso)
        let turmasDoCurso = await findTurmaByIdCursoService(idCurso)
        //return res.send({turmasDoCurso})
        formandosDoCurso.forEach(async formando => {
            formando.matriculado = false
            formando.idCurso = null
            formando.idTurma = null
            await findFormandoAndUpdateServece(formando._id, formando)
        });

        turmasDoCurso.forEach(async turma => {
            await findTurmaByIdAndDeleteSerice(turma._id)
        });


        await findCursoAndDeleteServece(idCurso)

        req.flash("error_msg", "Curso de " + nomeCurso + " deletado com sucesso!")
        return res.redirect("/pedagogico/cursos")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const listaCurso = async (req, res) => {
    try {
        let idCurso = req.params.id
        let curso = await findCursoByIDService(idCurso)
        let tdFormandos = await findFormandosByIdCurso(idCurso)
        let formandos = []
        const date = new Date();
        let ano = date.getFullYear();

        //return res.send({formandos})

        let numOrdem = 1
        tdFormandos.forEach(formando => {
            if (formando.candidato == false) {

                formando.numOrdem = numOrdem
                if (formando.dataNascimento) {
                    formando.idade = parseInt(ano) - parseInt(formando.dataNascimento.getFullYear())
                    //  if(formando.matriculado){formando.estado = "Admitido"}else{formando.estado = "N/Admitido"}

                }
                formandos.push(formando)
                numOrdem++

            }
        });
        return res.render("cursos/listaCurso", { curso, formandos })

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const listaCursoPDF = async (req, res) => {
    try {
        const idCurso = req.params.id
        let formandos = await findFormandosByIdCurso()
        let curso = await findCursoByIDService(idCurso)

        const date = new Date();
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();

        formandos.forEach(formando => {
            formando.idade = parseInt(ano) - parseInt(formando.dataNascimento.getFullYear())

            // if(formando.matriculado == true){formando.estado = "Admitido"}else{formando.estado = "N/Admitido"}
        });


        //return res.send({formandos})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/listaCurso.ejs", { formandos, dia, mes, ano, curso }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                const options = {
                    format: "A4",
                    margin: {
                        top: '10px',
                        bottom: '20px',
                        left: '20px',
                        right: '20px'
                    },
                    header: {
                        height: "15mm"
                    },
                    footer: {
                        height: "25mm"
                    }

                }
                pdf.create(html, options).toFile("./relatorios/Lista-" + curso.nomeCurso + ".pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu ao guradar lista')
                    } else {
                        req.flash('success_msg', 'Lista gerada com sucesso! veja na pasta de relatórios em C:/')
                        res.redirect('/pedagogico/listaCurso/' + idCurso)
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}



/* GESTÃO DE TURMAS */
export const turmas = async (req, res) => {
    try {
        let autorizado = false
        const userLog = req.user
        if (userLog) {
            if (userLog.categoria == "secretario" || userLog.categoria == "admin") { autorizado = true }
        }
        let turmas = await findAllTurmasService()

        /* Contar matriculados em cada turma */
        turmas.forEach(async turma => {
            let matriculados = await findFormandosByIDTurmaService(turma._id)
            turma.matriculados = matriculados.length
        });

        //return res.send({curso})
        res.render("pedagogico/turmas", { turmas, autorizado })
    } catch (error) {
        return res.status(500).send({ mesase: mesage.error })
    }
}

export const adTurma = async (req, res) => {
    try {
        const turma = req.body
        //return res.send({turma})
        const verifyTurma = await findTurmaByNomeTurma(turma.nomeTurma)
        if (verifyTurma) {
            req.flash("error_msg", "ERRO! Já existe uma turma com o nome " + verifyTurma.nomeTurma + " Usa outro nome!")
            res.redirect("/pedagogico/curso/" + turma.idCurso)
        } else {
            await createTurmaService(turma)
            req.flash("success_msg", "Nova Turma adicionada com sucesso!")
            res.redirect("/pedagogico/curso/" + turma.idCurso)
        }
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const adFormadorTurma = async (req, res) => {
    try {
        const { idCurso, nomeModulo, idTurma, idFormador } = req.body

        let retornarAMinipautas = false


        const idF = idFormador
        let formador = await findFuncionariosByIdService(idFormador)
        let exist = ''
        formador.turmas.forEach(element => {
            if (element == idTurma) {
                exist = 'Este professor ja é desta turma!'

            }
        });
        if (exist == '') {
            formador.turmas.push(idTurma)
            formador.disciplinas.push(nomeModulo)
            const minipauta = {
                nomeModulo: nomeModulo,
                idFormador: formador._id,
                idTurma: idTurma,
                idCurso: idCurso,
            }

            const formandos = await findFormandosByIDTurmaService(idTurma)
            const alunosMinipauta = []
            formandos.forEach(element => {
                alunosMinipauta.push(element._id)
            });
            minipauta.alunos = alunosMinipauta
            const novaMinipauta = await creatMinipautaService(minipauta)
            const idMinipauta = novaMinipauta._id
            formador.minipautas.push(idMinipauta)
            const profUpdate = await findFuncionarioByIdAndUpdateService(idFormador, formador)
            //return res.send({profUpdate})
            //disciplina.idProfessor = professor._id
            //const disciplinaUpdate = await findDisciplinaByIdAndUpdateService(idDisciplina, disciplina)
            // return res.send("Sucesso!")

            req.flash('success_msg', 'Novo Formador adicionado!')
            return res.redirect('/pedagogico/turma/' + idTurma)

            if (retornarAMinipautas) {

                req.flash('success_msg', 'Modulo adicionado com sucesso!')
                return res.redirect('/pedagogico/turma/' + idTurma)
            } else {

                req.flash('success_msg', 'Novo Formador adicionado!')
                return res.redirect('/pedagogico/turma/' + idTurma)
            }

        } else {
            req.flash('error_msg', '' + exist)
            res.redirect('/pedagogico/turma/' + idTurma)
        }


    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const turma = async (req, res) => {
    try {

        let autorizado = false
        const userLog = req.user
        if (userLog) {
            if (userLog.categoria == "secretario" || userLog.categoria == "admin") { autorizado = true }
        }

        const idTurma = req.params.id
        let turma = await findTurmaByIdService(idTurma)
        let curso = await findCursoByIDService(turma.idCurso)
        const modulos = await findModulosByIdCursoSercice(curso._id)
        const formandosPTurma = await findFormandosByIDTurmaService(idTurma)
        const formadores = await findAllFormadoresServoce()
        const todosFormandos = await findFormandosByIdCurso(curso._id)
        //return res.send({formandos})
        let formandos = []
        formandosPTurma.forEach(formando => {
            if (formando.candidato == false) { formandos.push(formando) }
        });
        /* Selecionar todos Formandos do Curso que ainda não efectuaram a matricula */
        let formandosDoCurso = []
        todosFormandos.forEach(formando => {
            if (formando.idCurso == curso._id && formando.matriculado == false && formando.candidato == false && formando.admitido == true) {
                formando.idTurma = idTurma
                formandosDoCurso.push(formando)
            }
        });
        //return res.send({formandosDoCurso})

        /* Númerar os formandos da turma */
        let numOrd = 1
        formandos.forEach(formando => {
            formando.numOrd = numOrd
            numOrd++
        });
        const dia = turma.dataInicio.getDay()
        const mes = turma.dataInicio.getMonth()
        const ano = turma.dataInicio.getFullYear()
        const dataInicio = dia + " / " + mes + " / " + ano

        const diaF = turma.dataFim.getDay()
        const mesF = turma.dataFim.getMonth()
        const anoF = turma.dataFim.getFullYear()
        const dataFim = diaF + " / " + mesF + " / " + anoF

        res.render("turmas/turma", { dataInicio, dataFim, turma, curso, formandos, formandosDoCurso, formadores, modulos, autorizado })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const listasPDF = async (req, res) => {
    try {
        let formandos = await findAllFormandosService()

        const date = new Date();
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();

        formandos.forEach(formando => {
            formando.idade = parseInt(ano) - parseInt(formando.dataNascimento.getFullYear())
        });


        //return res.send({formando})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/listaFormandos.ejs", { formandos, dia, mes, ano }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                const options = {
                    format: "A4",
                    margin: {
                        top: '10px',
                        bottom: '20px',
                        left: '20px',
                        right: '20px'
                    },
                    header: {
                        height: "15mm"
                    },
                    footer: {
                        height: "25mm"
                    }

                }
                pdf.create(html, options).toFile("./relatorios/Lista-Geral.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu ao guradar lista')
                    } else {
                        req.flash('success_msg', 'Lista gerada com sucesso! veja na pasta de relatórios em C:/')
                        res.redirect('/pedagogico/formandos')
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}


/* GESTÃO DE MODULOS */

export const modulos = async (req, res) => {
    try {
        res.render("pedagogico/modulos")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const adModulo = async (req, res) => {
    try {
        const modulo = req.body


        await createModulo(modulo)
        req.flash("success_msg", "Novo Modulo adicionado com sucesso!")
        res.redirect("/pedagogico/curso/" + modulo.idCurso)
    } catch (error) {
        return res.status(500).send({ mesase: mesage.error })
    }
}

export const acoes = async (req, res) => {
    try {
        res.render("pedagogico/acoes")
    } catch (error) {
        return res.status(500).send({ mesase: mesage.error })
    }
}

/* GESTÃO DE FORMANDOS */

export const formandos = async (req, res) => {
    try {
        let tdFormandos = await findAllFormandosService()

        let formandos = []
        let candidatos = []
        let autorizado = false
        const userLog = req.user
        if (userLog) {
            if (userLog.categoria == "secretario" || userLog.categoria == "admin") { autorizado = true }
        }

        let numOrdem = 1
        tdFormandos.forEach(formando => {
            /* let anoFormando = parseInt(formando.dataNascimento.getFullYear())
            const anoAct = parseInt(new Date().getFullYear())
            const idade = anoAct - anoFormando */
            formando.idade = "Nd"
            formando.numOrdem = numOrdem
            numOrdem++
            if (formando.candidato == true) { candidatos.push(formando) } else { formandos.push(formando) }

        });
        //return res.send({tdFormandos})

        res.render("pedagogico/formandos", { formandos, candidatos, autorizado })
    } catch (error) {
        return res.status(500).send({ mesase: mesage.error })
    }
}


export const novoFormando = async (req, res) => {
    try {
        const formandos = await findAllFormandosService()
        let cursos = await findAllMinipautasService()()
        const numero = "INEFOP" + formandos.length + 1
        const id = (numero * 3) - 1
        const data = new Date().getFullYear()
        const idString = id + "-Fd" + data

        /* Verificar vagas em cada curso */
        let vagasDisponiveis = false
        cursos.forEach(curso => {
            if (curso.vagas > 0) { curso.disponivel = true; vagasDisponiveis = true }
        });
        return res.render("formando/novoFormando", { idString, numero, cursos, vagasDisponiveis })

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const adNovoFormando = async (req, res) => {
    try {
        let { email, senha, senha2, categoria, nome, numBI, idCurso, id, numero, centro, genero, dataNascimento, lingua, dataAdmissao, dataSaida, curso, estadoCivil, inicioCarreiraP, ultimoActEmpregador, carteiraProf, especialidade, grupoProfissional, naturalidade, provincia, municipio, tipoDocumento, dataEmissaoBI, dataValidadeBI, necessidadeEspecial, descricaoNEE, outInfPessoais, arquivo, nacionalidade, numContribuinte, endereco, bairro, localidade, nivelAcademico, areaFormacao, instituicaoEnsino, cursosReferentes, telefone, telefone2, telefixo, candidato } = req.body

        if (candidato == "" || candidato == undefined) { candidato = false } else { candidato = true }

        const username = email
        const novoUser = { nome, username, senha, categoria, telefone }

        const userCriado = await createUserService(novoUser)
        const usuario = userCriado._id

        let formando = {
            nome: nome,
            numBI: numBI,
            id: id,
            numero: numero,
            centro: centro,
            genero: genero,
            dataNascimento: dataNascimento,
            lingua: lingua,
            dataAdmissao: dataAdmissao,
            dataSaida: dataSaida,
            curso: curso,
            estadoCivil: estadoCivil,
            inicioCarreiraP: inicioCarreiraP,
            ultimoActEmpregador: ultimoActEmpregador,
            carteiraProf: carteiraProf,
            especialidade: especialidade,
            grupoProfissional: grupoProfissional,
            naturalidade: naturalidade,
            provincia: provincia,
            municipio: municipio,
            tipoDocumento: tipoDocumento,
            dataEmissaoBI: dataEmissaoBI,
            dataValidadeBI: dataValidadeBI,
            necessidadeEspecial: necessidadeEspecial,
            descricaoNEE: descricaoNEE,
            outInfPessoais: outInfPessoais,
            arquivo: arquivo,
            nacionalidade: nacionalidade,
            numContribuinte: numContribuinte,
            endereco: endereco,
            bairro: bairro,
            localidade: localidade,
            nivelAcademico: nivelAcademico,
            areaFormacao: areaFormacao,
            instituicaoEnsino: instituicaoEnsino,
            cursosReferentes: cursosReferentes,
            telefone: telefone,
            telefone2: telefone2,
            telefixo: telefixo,
            usuario: usuario,
            idCurso: idCurso,
            candidato: candidato
        }
        const novoFormando = await createFormandoService(formando)
        //return res.send({ novoFormando })

        /* Se for um candidato a fazer registro, volta para a pagina de login */
        if (candidato == true) {
            req.flash("success_msg", "Registro efectuado com sucesso!")
            return res.redirect("/pedagogico/comprovativo/" + novoFormando._id)
        }

        /* Caso contrário, é redirecionado para a lista dos formandos */
        req.flash("success_msg", "Novo Formando cadastrado com sucesso!")
        return res.redirect("/pedagogico/formandos")

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editarFormando = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        formando.idade = parseInt(new Date().getFullYear()) - parseInt(formando.dataNascimento.getFullYear())
        formando.dataNascimento = formando.dataNascimento.getDate() + "/" + formando.dataNascimento.getMonth() + "/" + formando.dataNascimento.getFullYear()
        //return res.send({formando})
        res.render("formando/editarFormando", { formando })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editarFormandoSave = async (req, res) => {
    try {
        const dados = req.body

        const formando = await findFormandoAndUpdateServece(req.body.idFormando, dados)
        req.flash("success_msg", "Dados actualizados com êxito")
        return res.redirect("/formando/ficha/" + formando.usuario)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarFormando = async (req, res) => {
    try {
        const { idFormando, idUser } = req.body
        await findFormandoByIdAndDelete(idFormando)
        await findUserByIdAndDelet(idUser)
        req.flash("error_msg", "Dados eliminados com êxito!")
        return res.redirect("/pedagogico/formandos")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const matricular = async (req, res) => {
    try {
        const { idTurma, idFormando } = req.body
        let formando = await findFormandoByIdServise(idFormando)
        formando.idTurma = idTurma
        formando.matriculado = true
        await findFormandoAndUpdateServece(idFormando, formando)

        req.flash("success_msg", "Matricula efetuada com êxito!")
        return res.redirect("/pedagogico/turma/" + idTurma)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const pesquisarFormando = async (req, res) => {
    try {
        const { pesquisa } = req.body

        const formandos = await findAllFormandosService()
        let formandosPesquisados = []

        formandos.forEach(formando => {
            if (formando.nome == pesquisa || formando.numBI == pesquisa || formando.provincia == pesquisa || formando.numero == pesquisa) {
                formandosPesquisados.push(formando)
            }
        });

        req.flash("success_msg", "Matricula efetuada com êxito!")
        res.render("pedagogico/formandosPesq", { formandosPesquisados })

    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const carregaFoto = async (req, res) => {
    try {
        const { idFormando } = req.body
        let formando = await findFormandoByIdServise(idFormando)
        if (req.file) {
            //return res.send('Sucesso')

            formando.foto = req.file.filename
            await findFormandoAndUpdateServece(idFormando, formando)

            req.flash('success_msg', 'Foto carregada com sucesso!')
            return res.redirect("/formando/ficha/" + formando.usuario)

        } else {
            req.flash("error_msg", "Erro! Escolhe uma foto para carregar.")
            return res.redirect("/formando/ficha/" + formando.usuario)
        }
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const carregarBI = async (req, res) => {
    try {
        const { idFormando } = req.body
        let formando = await findFormandoByIdServise(idFormando)
        if (req.file) {
            //return res.send('Sucesso')

            formando.bilhete = req.file.filename
            await findFormandoAndUpdateServece(idFormando, formando)

            req.flash('success_msg', 'Bilhete de Identidade carregado com sucesso!')
            return res.redirect("/formando/ficha/" + formando.usuario)

        } else {
            req.flash("error_msg", "Erro! Escolhe a imagem do Bilhete para carregar.")
            return res.redirect("/formando/ficha/" + formando.usuario)
        }
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const carregarCertificado = async (req, res) => {
    try {
        const { idFormando } = req.body
        let formando = await findFormandoByIdServise(idFormando)
        if (req.file) {
            //return res.send('Sucesso')

            formando.certificado = req.file.filename
            await findFormandoAndUpdateServece(idFormando, formando)

            req.flash('success_msg', 'Certificado de Hablitação carregado com sucesso!')
            return res.redirect("/formando/ficha/" + formando.usuario)

        } else {
            req.flash("error_msg", "Erro! Escolhe a imagem do certificado de Hablitação para carregar.")
            return res.redirect("/formando/ficha/" + formando.usuario)
        }
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

/* GESTÃO DE CANDIDATOS */
export const autorizarcandidatura = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        formando.candidato = false
        await findFormandoAndUpdateServece(idFormando, formando)

        req.flash("success_msg", "Candidatura aceite!")
        return res.redirect("/formando/ficha/" + formando.usuario)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const comprovativo = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        //return res.send({formando})
        if (formando.dataInscrito) {
            let dataInscrito = formando.dataInscrito.getDay() + "/" + formando.dataInscrito.getMonth() + "/" + formando.dataInscrito.getFullYear()
            formando.dataInscrito = dataInscrito
        }
        if (formando.candidato) { formando.estado = "Inscrito" }
        return res.render("formando/comprovativo", { formando })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const comprovativoPDF = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        //return res.send({formando})
        if (formando.dataInscrito) {
            let dataInscrito = formando.dataInscrito.getDay() + "/" + formando.dataInscrito.getMonth() + "/" + formando.dataInscrito.getFullYear()
            formando.dataInscrito = dataInscrito
        }
        if (formando.candidato) { formando.estado = "Inscrito" }

        //return res.send({formando})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/comprovativo.ejs", { formando }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                const options = {
                    format: "A6",
                    margin: {
                        top: '10px',
                        bottom: '20px',
                        left: '20px',
                        right: '20px'
                    },
                    header: {
                        height: "15mm"
                    },
                    footer: {
                        height: "25mm"
                    }

                }
                pdf.create(html, options).toFile("./relatorios/Comp" + formando.numero + "-" + formando.nome + "-recibo.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu ao guradar lista')
                    } else {
                        req.flash('success_msg', 'Recibo gerada com sucesso! veja na pasta de relatórios em C:/')
                        res.redirect('/pedagogico/comprovativo/' + formando._id)
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const verFoto = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        //return res.send({formando})

        return res.render("formando/verFoto", { formando })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const verBI = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        //return res.send({formando})

        return res.render("formando/verBI", { formando })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const verCertificado = async (req, res) => {
    try {
        const idFormando = req.params.id
        let formando = await findFormandoByIdServise(idFormando)
        //return res.send({formando})

        return res.render("formando/verCertificado", { formando })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}



/* GESTÃO DE VAGAS */
export const gerirVagas = async (req, res) => {
    try {
        let cursos = await findAllMinipautasService()()
        let formandos = await findFormandosInscritosServece()
        let numOrdem = 1
        cursos.forEach(curso => {
            curso.numOrdem = numOrdem
            numOrdem++
            let inscritos = 0
            formandos.forEach(formando => {
                if (curso._id == "" + formando.idCurso) { inscritos++ }
            });
            curso.inscritos = inscritos
        });
        return res.render("pedagogico/vagas", { cursos })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const editarVaga = async (req, res) => {
    try {
        const { curso, vaga } = req.body
        let cursoUpdate = await findCursoByIDService(curso)
        cursoUpdate.vagas = vaga
        await findCursoByIdAndUpdateDServece(curso, cursoUpdate)

        req.flash("success_msg", "Vagas alterada com êxito!")
        return res.redirect("/pedagogico/gerirVagas")
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const admitir = async (req, res) => {
    try {
        const { idFormando, idCurso, admitido } = req.body
        let formando = await findFormandoByIdServise(idFormando)
        let curso = await findCursoByIDService(idCurso)
        //return res.send({ formando })
        if (admitido == "Sim") {
            formando.admitido = true
            formando.estado = "Admitido"
            if (formando.genero == "F") { formando.estado = "Admitida" }
            await findFormandoAndUpdateServece(idFormando, formando)
            curso.vagas = curso.vagas - 1
            await findCursoByIdAndUpdateDServece(idCurso, curso)
        } else {
            formando.admitido = true
            formando.estado = "N/Admitido"
            if (formando.genero == "F") { formando.estado = "N/Admitida" }
            await findFormandoAndUpdateServece(idFormando, formando)
        }

        req.flash("success_msg", "Operação realizada com sucesso!")
        return res.redirect("/pedagogico/listaCurso/" + idCurso)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}