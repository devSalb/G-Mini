import { findMinipautaByIdAndUpdateService, findMinipautaByIdService } from "../services/minipauta.service.js"




export const verifySeJaLancouNotas = async (trimeste, notaDe, idMinipauta) => {
    try {
        const miniPauta = await findMinipautaByIdService(idMinipauta)
        let lancada = ''
        /* P r i m e i r o   T r i m e s t r e */
        if (trimeste == 'primeiro') {
            if (notaDe == 'avaliacao1') {
                if (miniPauta.lancadoAV1T1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao2') {
                if (miniPauta.lancadoAV2T1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao3') {
                if (miniPauta.lancadoAV3T1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'mac1') {
                if (miniPauta.lancadoMac1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoProfessor') {
                if (miniPauta.lancadoPPT1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoTrimestre') {
                if (miniPauta.lancadoPTT1 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
        }

        /* S e g u n d o   T r i m e s t r e */
        if (trimeste == 'segundo') {
            if (notaDe == 'avaliacao1') {
                if (miniPauta.lancadoAV1T2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao2') {
                if (miniPauta.lancadoAV2T2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao3') {
                if (miniPauta.lancadoAV3T2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'mac2') {
                if (miniPauta.lancadoMac2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoProfessor') {
                if (miniPauta.lancadoPPT2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoTrimestre') {
                if (miniPauta.lancadoPTT2 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
        }
        /* T e r e i r o   T r i m e s t r e */
        if (trimeste == 'terceiro') {
            if (notaDe == 'avaliacao1') {
                if (miniPauta.lancadoAV1T3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao2') {
                if (miniPauta.lancadoAV2T3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'avaliacao3') {
                if (miniPauta.lancadoAV3T3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'mac3') {
                if (miniPauta.lancadoMac3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoProfessor') {
                if (miniPauta.lancadoPPT3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'provaDoTrimestre') {
                if (miniPauta.lancadoPTT3 == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
        }
        /* C l a s s i f i c a ç ã o   F i n a l   - >   E x a m e   */
        if (trimeste == 'outro') {
            if (notaDe == 'provaOral') {
                if (miniPauta.lancadoExameOral == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
            if (notaDe == 'exame') {
                if (miniPauta.lancadoExameEscrito == 1) {
                    lancada = 'Ja se fez o lançamento desta nota!'
                }
            }
           
        }

        return lancada
    } catch (error) {
        return error
    }
}

export const fixarLancamentoNaMinipauta = async (trimeste, notaDe, idMinipauta) => {
    try {
        const miniPauta = await findMinipautaByIdService(idMinipauta)
        /* P R I M E I R O   T R I M E S T R E  */
        if (trimeste == 'primeiro') {
            if (notaDe == 'avaliacao1') {
                miniPauta.lancadoAV1T1 = 1
            }
            if (notaDe == 'avaliacao2') {
                miniPauta.lancadoAV2T1 = 1
            }
            if (notaDe == 'avaliacao3') {
                miniPauta.lancadoAV3T1 = 1
            }
            if (notaDe == 'mac1') {
                miniPauta.lancadoMac1 = 1
            }
            if (notaDe == 'provaDoProfessor') {
                miniPauta.lancadoPPT1 = 1
            }
            if (notaDe == 'provaDoTrimestre') {
                miniPauta.lancadoPTT1 = 1
            }
        }

        /* S E G U N D O   T R I M E S T R E  */
        if (trimeste == 'segundo') {
            if (notaDe == 'avaliacao1') {
                miniPauta.lancadoAV1T2 = 1
            }
            if (notaDe == 'avaliacao2') {
                miniPauta.lancadoAV2T2 = 1
            }
            if (notaDe == 'avaliacao3') {
                miniPauta.lancadoAV3T2 = 1
            }
            if (notaDe == 'mac2') {
                miniPauta.lancadoMac2 = 1
            }
            if (notaDe == 'provaDoProfessor') {
                miniPauta.lancadoPPT2 = 1
            }
            if (notaDe == 'provaDoTrimestre') {
                miniPauta.lancadoPTT2 = 1
            }
        }
        /* T E R C E I R O  T R I M E S T R E  */
        if (trimeste == 'terceiro') {
            if (notaDe == 'avaliacao1') {
                miniPauta.lancadoAV1T3 = 1
            }
            if (notaDe == 'avaliacao2') {
                miniPauta.lancadoAV2T3 = 1
            }
            if (notaDe == 'avaliacao3') {
                miniPauta.lancadoAV3T3 = 1
            }
            if (notaDe == 'mac3') {
                miniPauta.lancadoMac3 = 1
            }
            if (notaDe == 'provaDoProfessor') {
                miniPauta.lancadoPPT3 = 1
            }
            if (notaDe == 'provaDoTrimestre') {
                miniPauta.lancadoPTT3 = 1
            }
        }
        /* C L A S S I F I C A Ç Ã O   F I N A L   /   E X A M E   */
        if (trimeste == 'outro') {
            if (notaDe == 'exame') {
                miniPauta.lancadoExameEscrito = 1
            }
            if (notaDe == 'provaOral') {
                miniPauta.lancadoExameOral = 1
            }
            
        }
        const miniPautaUpdate = await findMinipautaByIdAndUpdateService(idMinipauta, miniPauta)
    } catch (error) {
        return error
    }
}


