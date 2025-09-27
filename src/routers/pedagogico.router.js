import { Router } from "express";
import { acoes, adFormadorTurma, admitir, adModulo, adNovoFormando, adTurma, autorizarcandidatura, carregaFoto, carregarBI, carregarCertificado, comprovativo, comprovativoPDF, curso, minipautas, cursosPublic, deleteCurso, editarFormando, editarFormandoSave, editarVaga, editCurso, eliminarFormando, formandos, gerirVagas, homePedagogica, listaCurso, listaCursoPDF, listasPDF, matricular, modulos, novoCursoSave, novoCursoW, novoFormando, pesquisarFormando, turma, turmas, verBI, verCertificado, verFoto } from "../controll/pedagogico.controll.js";
import { validFildFormando, validFildFormandoEdit } from "../middlewares/user.middlewer.js";
const router = Router()

/* tratamento de upload de imagens */
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
const upload = multer({storage: storage});

router.get("/", homePedagogica)

/* Gestão de Minipautas  */
router.get("/minipautas", minipautas)
router.get("/curso/:id", curso)
router.get("/novoCurso", novoCursoW)
router.post("/novoCursoSave", novoCursoSave)
router.get("/cursosPublic", cursosPublic)
router.post("/editCurso", editCurso)
router.post("/deleteCurso", deleteCurso)
router.get("/listaCurso/:id", listaCurso)
router.get("/listaCursoPDF/:id", listaCursoPDF)


/* Gestão de Turmas */
router.get("/turmas", turmas)
router.get("/turma/:id", turma)
router.post("/adTurma", adTurma)
router.post("/adFormadorTurma", adFormadorTurma)
router.get("/listasPDF", listasPDF)

/* Gestão de Módulos */
router.get("/modulos", modulos)
router.post("/adModulo", adModulo)

router.get("/acoes", acoes)

/* Gestão de Formandos / Candidatos */
router.get("/formandos", formandos)
router.get("/novoFormando", novoFormando)
router.post("/adNovoFormando", validFildFormando, adNovoFormando)
router.get("/editarFormando/:id", editarFormando)
router.post("/editarFormando", validFildFormandoEdit, editarFormandoSave)
router.post("/eliminarFormando", eliminarFormando)
router.post("/matricular", matricular)
router.get("/autorizarcandidatura/:id", autorizarcandidatura)
router.post("/pesquisarFormando", pesquisarFormando)
router.get("/comprovativo/:id", comprovativo)
router.get("/comprovativoPDF/:id", comprovativoPDF)
router.post("/carregarFoto", upload.single('foto'), carregaFoto)
router.post("/carregarBI", upload.single('bilhete'), carregarBI)
router.post("/carregarCertificado", upload.single('certificado'), carregarCertificado)
router.get("/verFoto/:id", verFoto)
router.get("/verBI/:id", verBI)
router.get("/verCertificado/:id", verCertificado)

/* Gestão de Vagas */
router.get("/gerirVagas", gerirVagas)
router.post("/editarVaga", editarVaga)
router.post("/admitir", admitir)

export default router