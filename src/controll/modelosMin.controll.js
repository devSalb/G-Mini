

export const modelosMinipauta = (req, res) => {
    try {
        res.render("modelosMinipauta/homeModelos")
    } catch (error) {
        return res.status(500).send({mesage: error.mesage})
    }
}