const Catraca = require ("./catraca")

const exec = async () => {
    const catraca = new Catraca("192.168.0.185", 3000)
    await catraca.conectar()
    catraca.liberarEntrada()
}

exec()