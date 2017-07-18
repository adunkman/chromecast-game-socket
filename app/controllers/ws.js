const humanReadableId = require("human-readable-ids").hri
const SocketsModel = require("../models/sockets")
const sockets = new SocketsModel()

module.exports = (ws) => {
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
            sockets.send(ws, "room_id", { room_id })
            return
          }
        }
        while (true)
      }

      if (message.type === "join_room") {
        sockets.join(ws, message.data.room_id)
        const in_room = sockets.in(message.data.room_id)
        sockets.broadcast(in_room, "room_count", { room_count: in_room.length })
        return
      }
    })
  })

  setInterval(() => {
    sockets.broadcast(sockets.all(), "hello", { hi: "👋" })
  }, 30000)
}
