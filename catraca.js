const { Socket, connect } = require('net')

const RELEASE_TIME = 40 // Tempo de liberação da catraca

class Catraca {
    constructor(ip, port) {
        this.ip = ip
        this.port = port
    }

    liberarEntrada(message = 'SEJA BEM VINDO') {
        this.enviar(`33+REON+00+4]${RELEASE_TIME}]SEJA BEM VINDO]}1`)
    }

    checksum(message) {
        let data = []

        for (let i=0;i<message.length;i++) {
            data.push(message[i].charCodeAt(0))
        }

        let cs = data[1]

        for (let i=0;i<=data.length;i++) {
            cs = cs ^ data[i]
        }

        return cs
    }

    enviar(message) {
        const size = String.fromCharCode(message.length) + '\x00'

        const checksum = this.checksum(size + message)

        const full = `\x02${size}${message}${String.fromCharCode(checksum)}\x03`

        this.socket.write(full)
    }

    conectar() {
        return new Promise((resolve, reject) => {
            this.socket = connect({
                host: this.ip,
                port: this.port
            })
            this.socket.on('connect', () => {
                console.log('Conectou o socket')
                resolve()
            })
        })
    }

    escutar() {
        const message = this.socket.read(1024)

        if (!message) {
            this.socket.destroy()

            return
        }

        let command = ''

        for (let i=7; i!==43 && i<message.length - 1; i++) {
            command += message.chartAt(i)
        }

        console.log(command)
    }
}

module.exports = Catraca