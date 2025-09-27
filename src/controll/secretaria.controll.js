

export const secretariaHome = async (req, res) => {
    try {
        res.render('secretaria/homeSecretaria')
    } catch (error) {
        return res.status(500).send({mesage: mesage.error})
    }
}