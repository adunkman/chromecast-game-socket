const http = require("http")
const WebSocket = require("ws")
const express = require("express")
const log = require("bunyan").createLogger({ name: "server" })
const app = express()
const server = http.createServer(app)
const ws = new WebSocket.Server({server})

const port = process.env.PORT || 3000

app.set("views", "app/views")
app.set("view engine", "hbs")
app.engine("hbs", require("express-handlebars")({
  defaultLayout: false,
  extname: "hbs"
}))

app.disable("x-powered-by")

require("./app/controllers/assets.js")(app)
require("./app/controllers/index.js")(app)
require("./app/controllers/ws.js")(ws)

server.listen(port, () => log.info(server.address(), "server listening"))
