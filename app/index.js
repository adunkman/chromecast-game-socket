const humanReadableId = require("human-readable-ids").hri
const http = require("http")
const WebSocket = require("ws")
const express = require("express")
const app = express()
const server = http.createServer(app)
const ws = new WebSocket.Server({server})

const SocketsCollection = require("./collections/sockets")
const sockets = new SocketsCollection()

const port = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === "production"

app.engine("hbs", require("express-handlebars")({
  defaultLayout: false,
  extname: "hbs"
}))
app.set("view engine", "hbs")

app.disable("x-powered-by")

app.get("/assets/index.js", require("connect-browserify")({
  entry: "assets/javascripts/index.js",
  extensions: [".js", ".hbs"],
  transforms: [
    require("hbsfy").configure({extensions: ["hbs"]})
  ],
  debug: !isProduction
}))

app.get("/", (req, res) => {
  res.render("index", {
    is_chromecast: req.headers["user-agent"].includes("CrKey")
  })
})

ws.on("connection", (ws, req) => {
  sockets.add(ws)
  ws.on("close", () => sockets.remove(ws))

  ws.on("message", (message) => {
    try { message = JSON.parse(message) }
    catch (e) {}

    if (!message || !message.type) { return; }

    if (message.type === "generate_room_id") {
      do {
        const room_id = humanReadableId.random()

        if (!sockets.in(room_id).length) {
          ws.send(JSON.stringify({type: "room_id", data: { room_id }}))
          return
        }
      }
      while (true)
    }

    if (message.type === "join_room") {
      sockets.join(ws, message.data.room_id)
      return
    }
  })
})

server.listen(port, () => console.log("server listening", server.address()))
