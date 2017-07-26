const Hapi = require("hapi")
const Nes = require("nes")

const server = new Hapi.Server()
const logger = require("bunyan").createLogger({ name: "server" })

server.connection({
  host: "0.0.0.0",
  port: process.env.PORT || 3000
})

server.register(Nes)
server.register({register: require("hapi-bunyan"), options: {logger}})

require("./app/controllers/rooms")(server)

server.start((err) => {
  if (err) { throw err }
  logger.info(server.info, "server listening")
})
