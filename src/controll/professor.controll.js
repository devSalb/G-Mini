import { findFuncionarioByUsernameServise, findFuncionariosByIdService, findFuncionariosUser } from "../services/funcionario.service.js"
import { findByUsernameService, findUserByIdAndDelet, findUserByIdService } from "../services/usuario.service.js"
import { creatMinipautaService, findMiniPautaByIdAndDelete, findMinipautaByIdAndUpdateService, findMinipautaByIdService, findMinipautasByIdProfessorService } from "../services/minipauta.service.js"
import { createAlunoService, findAlunoAnDeleteSercice, findAlunoByIdService, findAlunosByIdTurma } from "../services/alunos.servece.js"
import { createNotasDisciplinaService, findNotaDisciplinaByIdAndDeleteService, findNotasDisciplinaByIdAluno, findNotasDisciplinaByIdMinipautaService, findNotasModuloByIdFormando } from "../services/notasDisciplina.service.js"
import { veryNotaFalhas } from "../outrasF/minipauta.OutF.js"
import { fixarLancamentoNaMinipauta, verifySeJaLancouNotas } from "../outrasF/ocorrFunc.js"
import { createNotaTrimestral, findNotaByIdAndUpdateSerice, findNotasExistentByIdService, findNotasTrimestralByIdAndDeleteServece } from "../services/notas.service.js"
import { calcularMedias } from "../middlewares/professor.middlewere.js"
import { createUserService } from "../services/user.service.js"



export const homeFormador = async (req, res) => {
    try {
        const idFuncionario = req.params.id
        //return res.send({idFuncionario})
        let funcionario = await findFuncionariosByIdService(idFuncionario)
        if (funcionario == null) {
            let user = await findUserByIdService(idFuncionario)
            let idUser = user._id
            let funcionarioN = await findFuncionariosUser(idUser)
            funcionario = funcionarioN

            //return res.send({ funcionarioN })
        }
        if (funcionario == null) { return res.send("Usuário BLOQUEADO!") }

        //return res.send({ funcionario })
        return res.render("professor/homeFormador", { funcionario })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const curriculum = async (req, res) => {
    try {
        const userLog = req.user
        if (userLog == "" || userLog == null) { return res.redirect("/usuario/login") }
        const username = userLog.username;
        const funcionario = await findFuncionarioByUsernameServise(username)
        const user = await findByUsernameService(username)
        return res.render("formador/curriculum", { funcionario, user })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const criarMiniPauta = async (req, res) => {
    try {
        const minipauta = req.body

        const novaMinipauta = await creatMinipautaService(minipauta)
        req.flash("success_msg", "Minipauta criada com sucesso!")
        res.redirect("/professor/minipautas/" + novaMinipauta.idProfessor)
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const minipautas = async (req, res) => {
    try {
        const id = req.params.id
        const professor = await findFuncionariosByIdService(id)
        //const idTurmas = professor.turmas
        const idProfessor = id
        let minipautas = await findMinipautasByIdProfessorService(idProfessor)
        minipautas.forEach(async minipauta => {
           const alunos = await findAlunosByIdTurma(minipauta._id) 
           minipauta.alunos = alunos
        });
        //return res.send({minipautas})


        res.render('professor/minipautas', { professor, minipautas })
    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const minipauta = async (req, res) => {
    try {
        const user = req.user
        let lancarNota = ''
        const id = req.params.id
        const minipauta = await findMinipautaByIdService(id)
        const idMinipauta = minipauta._id
        let alunosTurma = await findAlunosByIdTurma(idMinipauta)
        //const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(id)
        const usuario = minipauta.idProfessor.usuario
        const VeryNotasModulo = await findNotasDisciplinaByIdMinipautaService(id)
        let notasDisciplina = await findNotasDisciplinaByIdMinipautaService(id)
        let notasDisciplinaOrdem = []
        let autorizaLancamento = false

        /* VERIFICANDO SE HA NOTAS QUE FALHARAM NO LANÇAMENTO */

        let alunosTurmaFalha = []
        const falhaNota = await veryNotaFalhas(notasDisciplina, minipauta)
        const msgFalhaLancada = falhaNota.message
        const trimestre = falhaNota.trimestre
        const avalDe = falhaNota.avF
        if (falhaNota.trimestre == 'primeiro') {
            if (falhaNota.notaDe == 'avaliacao1') {
                alunosTurmaFalha = falhaNota.alunosSemAV1
            }
            if (falhaNota.notaDe == 'avaliacao2') {
                alunosTurmaFalha = falhaNota.alunosSemAV2
            }
            if (falhaNota.notaDe == 'avaliacao3') {
                alunosTurmaFalha = falhaNota.alunosSemAV3
            }
            if (falhaNota.notaDe == 'mac1') {
                alunosTurmaFalha = falhaNota.alunosSemMac1
            }
            if (falhaNota.notaDe == 'provaDoProfessor') {
                alunosTurmaFalha = falhaNota.alunosSemPP
            }
            if (falhaNota.notaDe == 'provaDoTrimestre') {
                alunosTurmaFalha = falhaNota.alunosSemPT
            }
        }//Falta outros trimestre


        /* Numerar */
        let numeroOrd = 1
        let numeroOrd2 = 1
        notasDisciplina.forEach(aluno => {
            aluno.numeroOrd = numeroOrd++
        });

        alunosTurma.forEach(aluno => {
            aluno.numeroOrd = numeroOrd2++
        });

        if (user) {

            if (user._id == usuario) {
                lancarNota = 'Autorisado'
            }
        }
        //return res.send({user})

        /* Marcar as negativas a vermelhp */
        notasDisciplina.forEach(notasD => {
            /* I Trimestre */
            if (notasD.notas.av1T1 < 10) { notasD.notas.negativaAv1T1 = 'Negativa' }
            if (notasD.notas.av2T1 < 10) { notasD.notas.negativaAv2T1 = 'Negativa' }
            if (notasD.notas.av3T1 < 10) { notasD.notas.negativaAv3T1 = 'Negativa' }
            if (notasD.notas.mac1 < 10) { notasD.notas.negativaMac1 = 'Negativa' }
            if (notasD.notas.pp1 < 10) { notasD.notas.negativaPP1 = 'Negativa' }
            if (notasD.notas.pt1 < 10) { notasD.notas.negativaPT1 = 'Negativa' }
            if (notasD.notas.mt1 < 10) { notasD.notas.negativaMT1 = 'Negativa' }

            /* II Trimestre */
            if (notasD.notas.av1T2 < 10) { notasD.notas.negativaAv1T2 = 'Negativa' }
            if (notasD.notas.av2T2 < 10) { notasD.notas.negativaAv2T2 = 'Negativa' }
            if (notasD.notas.av3T2 < 10) { notasD.notas.negativaAv3T2 = 'Negativa' }
            if (notasD.notas.mac2 < 10) { notasD.notas.negativaMac2 = 'Negativa' }
            if (notasD.notas.pp2 < 10) { notasD.notas.negativaPP2 = 'Negativa' }
            if (notasD.notas.pt2 < 10) { notasD.notas.negativaPT2 = 'Negativa' }
            if (notasD.notas.mt2 < 10) { notasD.notas.negativaMT2 = 'Negativa' }

            /* III Trimestre */
            if (notasD.notas.av1T3 < 10) { notasD.notas.negativaAv1T3 = 'Negativa' }
            if (notasD.notas.av2T3 < 10) { notasD.notas.negativaAv2T3 = 'Negativa' }
            if (notasD.notas.av3T3 < 10) { notasD.notas.negativaAv3T3 = 'Negativa' }
            if (notasD.notas.mac3 < 10) { notasD.notas.negativaMac3 = 'Negativa' }
            if (notasD.notas.pp3 < 10) { notasD.notas.negativaPP3 = 'Negativa' }
            if (notasD.notas.pt3 < 10) { notasD.notas.negativaPT3 = 'Negativa' }
            if (notasD.notas.mt3 < 10) { notasD.notas.negativaMT3 = 'Negativa' }

            if (notasD.notas.medDosTrimestes < 10) { notasD.notas.negativaMt = 'Negativa' }
            if (notasD.notas.examePF < 10) { notasD.notas.negativaExame = 'Negativa' }
            if (notasD.notas.cf < 10) { notasD.notas.negativaCf = 'Negativa' }

        });
        notasDisciplina.forEach(dado => {
            notasDisciplinaOrdem.push({ nome: dado.aluno.nome })
        });
        // notasDisciplinaOrdem.sort()

        // return res.send({notasDisciplinaOrdem})
        // Verificar se a quantidade de alunos na minipauta pode autorizar lançar nota
        if(alunosTurma.length > 1){autorizaLancamento = true}

        res.render('professor/minipauta', {autorizaLancamento, minipauta, alunosTurma, notasDisciplina, lancarNota, msgFalhaLancada, trimestre, avalDe, falhaNota, alunosTurmaFalha: alunosTurmaFalha })


    } catch (error) {
        return res.status(500).send({ mesage: error.mesage })
    }
}

export const lancarNota = async (req, res) => {
    try {
        const notas = req.body.notas
        const idTurma = req.body.idTurma
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idTurma
        const idClasse = req.body.idTurma
        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe
        const notaString = req.body.nota
        const classe = req.body.classe
        //return res.send({notas, classe, idTurma, idProfessor, idMinipauta, idClasse, trimeste, notaDe, notaString})

        const alunos = await findAlunosByIdTurma(idTurma)
        let notaFalsa = false
        /* VERIFICANDO SE A NOTA JA FOI LANÇADA */
        const lancada = await verifySeJaLancouNotas(trimeste, notaDe, idMinipauta)
        const pass = false  // Uma constante temporária só para tirar a trave do lançamento, para usar em vez da costante lancada

        /* Bloquear o lançamento de nota do III trimestre para classe de exame  */
        /*  if (notaDe == "provaDoTrimestre" & trimeste == "terceiro" & classe == "12ª Classe") {
             const msdDeErro = "As classes de exames não fazem prova do Terceiro trimestre. Lance apenas as avaliações e a prova do professor do terceiro Trimestre"
             return res.render('msgError', { msdDeErro })
 
         } */

        if (pass) {
            const msdDeErro = "Ja se fez o lançamento das notas que esta tentando inserir novamente. Certifica-se de que selecionou o Trimestre e a avaliação correctamente. Por favor, volte e tente novamente"
            return res.render('msgError', { msdDeErro })

        } else {
            //return res.send('Ainda não se lançou estas notas!')
            let ind = 0
            const notasCap = []

            notas.forEach(async notaRec => {
                if (notaRec < 0 || notaRec > 20) {
                    notaFalsa = true
                } else {

                    //console.log(alunos[ind].nome+": "+nota)
                    const aluno = { id: alunos[ind]._id, nome: alunos[ind].nome, nota: notaRec }
                    notasCap.push({ aluno })
                    ind++
                }
            });
            //return res.send("Autorizado................")

            /* VERIFICAR SE HA NOTAS MENOR QUE ZERO OU MAIOR QUE 20 */
            if (notaFalsa) {
                const msdDeErro = "Digitaste nota maior que VINTE ou menor que ZERO! VOLTA E VERIFICA, OU LANÇA CORECTAMENTE.\n (Só deves inserir notas entre 0 à 20)"
                return res.render('msgError', { msdDeErro })
            }

            notasCap.forEach(notaC => {
                alunos.forEach(async aluno => {
                    if (aluno._id == notaC.aluno.id) {
                        let idAluno = notaC.aluno.id
                        let notaR = notaC.aluno.nota

                        //console.log('Localizaou: '+notaC.aluno.nome)
                        await lancarNotaExec(idTurma, idAluno, idMinipauta, notaR, idProfessor, trimeste, notaDe, classe)

                    }
                });
            });


            //return res.send('Passando!')

            /* FIXAR NA MINIPAUTA QUE JÁ SE FEZ LANÇAMENTO DE UMA DETERMINADA NOTA */
            await fixarLancamentoNaMinipauta(trimeste, notaDe, idMinipauta)



            req.flash('success_msg', 'Nota lançada com exito! \nActualiza a pagina por favor.')
            res.redirect("/professor/minipauta/" + idMinipauta)
        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}


const lancarNotaExec = async (idTurma, idAluno, idMinipauta, notaR, idProfessor, trimeste, notaDe, classe) => {
    console.log("sucesso no EXECUTAR!")
    console.log({ idTurma, idAluno, idMinipauta, notaR, idProfessor, trimeste, notaDe })
    let nota = parseInt(notaR)
    const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)
    const notasDoAluno = await findNotasModuloByIdFormando(idAluno)
    let verifNota = ''
    let notasAchada = ''
    notasDoAluno.forEach(element => {
        if (element.idMinipauta == idMinipauta) {
            verifNota = 'Ja'
            notasAchada = element.notas
        }
    });
    if (verifNota == '') {
        //return res.send("O aluno ainda não tem notas nesta discplina")
        console.log('O aluno ainda não tem notas nesta discplina')
        let novaNotasDoaluno = {
            aluno: idAluno,
            professor: idProfessor,
            idMinipauta: idMinipauta,
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
                case "mac1":
                    //   return res.send("Lançar nota no primeiro trimestre - mac1")
                    notaTrimestral.mac1 = nota

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
                case "mac2":
                    //   return res.send("Lançar nota no segungo trimestre - mac2")
                    notaTrimestral.mac2 = nota

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
                case "mac3":
                    //   return res.send("Lançar nota no terceiro trimestre - mac3")
                    notaTrimestral.mac3 = nota

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
        //console.log('CRIOU NOTAS!...................................................')
        const notasTrimCread = await createNotaTrimestral(notaTrimestral)
        novaNotasDoaluno.notas = notasTrimCread._id
        const notasDoAlunoCriada = await createNotasDisciplinaService(novaNotasDoaluno)
        const idNotaAch = notasDoAlunoCriada._id
        const notasExist = await findNotasExistentByIdService(idNotaAch)
        const notasUpdate = await findNotaByIdAndUpdateSerice(idNotaAch, notasExist)
        const aluno = await findAlunoByIdService(idAluno)
        /* let classe = await findClasseByIdService(formando.idClasse)
        classe = classe.designacao 
        console.log(classe) */

        const mediasActulizadas = await calcularMedias(idNotaAch, classe)


        //return res.send({ notasDoAlunoCriada })
        // req.flash('success_msg', 'Nota lançada com exito!')
        //res.redirect("/professor/minipauta/" + idMinipauta)
    } else {

        const idNotaAch = notasAchada._id
        const notasExist = await findNotasExistentByIdService(idNotaAch)
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
                    case "mac1":
                        //   return res.send("Lançar nota no primeiro trimestre - mac1")
                        notasExist.mac1 = nota

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
            //return res.send('oK!')
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
                    case "mac2":
                        //   return res.send("Lançar nota no segungo trimestre - mac2")
                        notasExist.mac2 = nota

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
                    case "mac3":
                        //   return res.send("Lançar nota no terceiro trimestre - mac3")
                        notasExist.mac3 = nota

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

            console.log('ACTUALIZOU! .....................................')
            const aluno = await findAlunoByIdService(idAluno)
            const classe = aluno.classe
            const mediasActulizadas = await calcularMedias(idNotaAch, classe)
            // return res.send({mediasActulizadas})
            //req.flash('success_msg', 'Nota lançada com exito!')
            // res.redirect("/professor/minipauta/" + idMinipauta)
        } else {
            console.log('As notas do aluno foram apagadas do sistema')

        }
    }


}

export const lancarNotaRep = async (req, res) => {
    try {

        const idTurma = req.body.idTurma
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idMinipauta
        const idClasse = req.body.idClasse
        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe

        const minipauta = await findMinipautaByIdService(idMinipauta)
        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)

        let alunosTurmaFalha = []
        let falhaNota = await veryNotaFalhas(notasDisciplina, minipauta)
        const msgFalhaLancada = falhaNota.message
        const trimestre = falhaNota.trimestre
        const avalDe = falhaNota.avF
        if (falhaNota.trimestre == 'primeiro') {
            if (falhaNota.notaDe == 'avaliacao1') {
                alunosTurmaFalha = falhaNota.alunosSemAV1
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'avaliacao1'
                });

            }
            if (falhaNota.notaDe == 'avaliacao2') {
                alunosTurmaFalha = falhaNota.alunosSemAV2
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'avaliacao2'
                });
            }
            if (falhaNota.notaDe == 'avaliacao3') {
                alunosTurmaFalha = falhaNota.alunosSemAV3
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'avaliacao3'
                });
            }
            if (falhaNota.notaDe == 'mac1') {
                alunosTurmaFalha = falhaNota.alunosSemMac1
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'avaliacao3'
                });
            }
            if (falhaNota.notaDe == 'provaDoProfessor') {
                alunosTurmaFalha = falhaNota.alunosSemPP
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'provaDoProfessor'
                });
            }
            if (falhaNota.notaDe == 'provaDoTrimestre') {
                alunosTurmaFalha = falhaNota.alunosSemPT
                alunosTurmaFalha.forEach(aluno => {
                    aluno.trimestre = 'primeiro'
                    aluno.notaDe = 'provaDoTrimestre'
                });
            }
        }//Falta outros trimestre

        // const notaString = req.body.alunosTurmaFalha
        //return res.send({alunosTurmaFalha})

        res.render('professor/repeatLancaNota', { minipauta, falhaNota, alunosTurmaFalha })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const lancarNotaRepSalve = async (req, res) => {
    try {
        const idAluno = req.body.idAluno
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idMinipauta
        const idClasse = req.body.idMinipauta
        const idTurma = req.body.idTurma

        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe
        const notaString = req.body.nota
        let nota = parseInt(notaString)
        //return res.send({idAluno, idProfessor, idMinipauta, idClasse, idTurma})

        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)
        const notasDoAluno = await findNotasDisciplinaByIdAluno(idAluno)
        //return res.send({notasDoAluno})

        let verifNota = ''
        let notasAchada = ''
        notasDoAluno.forEach(element => {
            if (element.idMinipauta == idMinipauta) {
                verifNota = 'Ja'
                notasAchada = element.notas
            }
        });


        //const xxx = await createNotaTrimestral(testNotas)

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
                    case "mac1":
                        //   return res.send("Lançar nota no primeiro trimestre - av3")
                        notaTrimestral.mac1 = nota

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
                    case "mac2":
                        //   return res.send("Lançar nota no segungo trimestre - av3")
                        notaTrimestral.mac2 = nota

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
                    case "mac3":
                        //   return res.send("Lançar nota no terceiro trimestre - mac3")
                        notaTrimestral.mac3 = nota

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
            //return res.send('Sucesso!!!!!!!!!!')
            req.flash('success_msg', 'Nota lançada com exito!')
            // res.redirect("/professor/minipauta/" + idMinipauta)
        } else {
            const idNotaAch = notasAchada._id
            const notasExist = await findNotasExistentByIdService(idNotaAch)
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
                        case "mac1":
                            //   return res.send("Lançar nota no primeiro trimestre - mac1")
                            notasExist.mac1 = nota

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
                        case "mac2":
                            //   return res.send("Lançar nota no segungo trimestre - mac2")
                            notasExist.mac2 = nota

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
                        case "mac3":
                            //   return res.send("Lançar nota no terceiro trimestre - mac3")
                            notasExist.mac3 = nota

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
                // res.redirect("/professor/minipauta/" + idMinipauta)
            } else {
                return res.send('As notas do aluno foram apagadas do sistea')

            }
        }

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

/* Esta função foi copiada do administrador */
export const addAlunoMinipauta = async (req, res) => {
    try {
        const { nome, turma, idTurma, numBI, classe, idMinipauta } = req.body


        //CRIAR USUÁRIO
        const nomeArray = nome.split(" ")
        const username0 = nomeArray[0] + '@ndunduma' + turma + '.' + nomeArray[1]
        const username = username0.toLocaleLowerCase()
        const senha = turma + '-' + nomeArray[1]

        //return res.send({senha})
        const novoUsuario = {
            nome: nome,
            username: username,
            senha: senha,
            categoria: 'aluno',
            telefone: ''
        }


        const aluno = {
            nome: nome,
            numBI: numBI,
            idTurma: idTurma,
            idMinipauta: idMinipauta,
            classe: classe,
            genero: 'Não definido',
            pai: 'Não definido',
            mae: 'Não definido',
            escolaAnt: 'Não definido',
            morada: 'Não definido',
            nomeEncarregado: 'Não definido',
            matricula: 'Confirmada',
        }

        const userAluno = await createUserService(novoUsuario)
        aluno.usuario = userAluno._id;
        await createAlunoService(aluno)

        req.flash('success_msg', 'Aluno adicionado com sucesso!')
        res.redirect('/professor/minipauta/' + idTurma)

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarAluno = async (req, res) => {
    try {
        const { idAluno, turma, idTurma, numBI, classe, idMinipauta } = req.body

        const aluno = await findAlunoByIdService(idAluno)
        const idUser = aluno.usuario._id
        const notasDisciplina = await findNotasDisciplinaByIdAluno(idAluno)
        const idNotaT = notasDisciplina[0].notas._id
        const idNotaDisc = notasDisciplina[0]._id
        const notas = await findNotasExistentByIdService(idNotaT)
        const user = await findUserByIdService(idUser)

        //return res.send({idNotaDisc})
        await findUserByIdAndDelet(idUser)
        await findNotaDisciplinaByIdAndDeleteService(idNotaDisc)
        await findNotasTrimestralByIdAndDeleteServece(idNotaT)
        await findAlunoAnDeleteSercice(idAluno)

        req.flash('error_msg', 'Aluno removido!')
        res.redirect('/professor/minipauta/' + idTurma)

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editarNotaMinipauta = async (req, res) => {
    try {
        const idAluno = req.body.aluno
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idMinipauta
        const idClasse = req.body.idMinipauta
        const classe = req.body.classe
        const idTurma = req.body.idTurma
        //return res.send({idAluno, idProfessor, idMinipauta, idClasse, idTurma})

        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe
        const notaString = req.body.nota
        let nota = parseInt(notaString)
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
                        case "mac1":
                            //   return res.send("Lançar nota no ")
                            notaTrimestral.mac1 = nota

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
                        case "mac2":
                            //   return res.send("Lançar nota n")
                            notaTrimestral.mac2 = nota

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
                        case "mac3":
                            //   return res.send("Lançar not")
                            notaTrimestral.mac3 = nota

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
                            case "mac1":
                                //   return res.send("Lançar nota no primeiro trimestre - av3")
                                notasExist.mac1 = nota

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
                            case "mac2":
                                //   return res.send("Lançar nota no segungo trimestre - av3")
                                notasExist.mac2 = nota

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
                            case "mac3":
                                //   return res.send("Lançar nota no terceiro trimestre - av3")
                                notasExist.mac3 = nota

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
                    const mediasActulizadas = await calcularMedias(idNotaAch, classe)
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

export const edidarMiniPauta = async (req, res) => {

    try {
        const idMinipauta = req.params.id
        const minipauta = await findMinipautaByIdService(idMinipauta)
        const idProfessor = minipauta.idProfessor
        const professor = await findFuncionariosByIdService(idProfessor)
        // return res.send({professor})
        res.render('professor/editarMiniPauta', { professor, minipauta })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editarMiniPauta2 = async (req, res) => {

    try {
        const { idMinipauta, idProfessor, idTurma, nomeDisciplina } = req.body
        let minipauta = await findMinipautaByIdService(idMinipauta)
        minipauta.disciplina = nomeDisciplina
        await findMinipautaByIdAndUpdateService(idMinipauta, minipauta)
        // return res.send({ minipauta })

        req.flash('success_msg', 'Minipauta editada com exito!')
        res.redirect('/professor/minipauta/' + idMinipauta)
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
        res.render('professor/eliminarMiniPauta', { professor, minipauta })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const eliminarMiniPauta2 = async (req, res) => {

    try {

        const { idMinipauta, idProfessor, idTurma, nomeDisciplina } = req.body

        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)

        let i = 0
        notasDisciplina.forEach(async notaD => {
            const idAluno = notaD.aluno._id
            const idUser = notaD.aluno.usuario
            const idNotaT = notasDisciplina[i].notas._id
            i++;
            
            //console.log({ idNotaT })
            await findNotasTrimestralByIdAndDeleteServece(idNotaT)
            await findAlunoAnDeleteSercice(idAluno)
            await findUserByIdAndDelet(idUser)
            await findNotaDisciplinaByIdAndDeleteService(notaD._id)
        });
        //return res.send({ notasDisciplina })

        //return res.send({notasDisciplina})
        //para remover o professor da turma e retiralo a minipauta
        //const result = await deleteTurmaProfService(idProfessor, idTurma, idMinipauta, nomeDisciplina)
        await findMiniPautaByIdAndDelete(idMinipauta)

        req.flash('error_msg', 'Minipauta eliminada com exito!')
        res.redirect('/professor/minipautas/' + idProfessor)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}