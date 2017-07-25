const url = require("url")
const humanReadableId = require("human-readable-ids").hri
const log = require("bunyan").createLogger({
  name: "ws",
  serializers: {
    ws: (ws) => ws.clientId
  }
})

const SocketsModel = require("../models/sockets")
const sockets = new SocketsModel()

const send = (ws, type, data) => {
  try {
    sockets.send(ws, type, data)
  }
  catch (e) {
    log.error({ws, type, data}, "message could not be sent")
    return
  }

  log.info({ws, type, data}, "message sent")
}

const controller = {
  create_room(ws) {
    do {
      const room_id = humanReadableId.random()

      if (!sockets.in(room_id).length) {
        sockets.join(ws, room_id)
        send(ws, "room_id", { room_id })
        return
      }
    }
    while (true)
  },

  join_room(ws, data) {
    const in_room = sockets.in(data.room_id)

    if (in_room.length) {
      sockets.join(ws, data.room_id)

      in_room.forEach((s) => {
        send(s.socket, "room_count", { room_count: in_room.length })
      })
    }
    else {
      send(ws, "room_empty")
    }
  }
}

module.exports = (ws) => {
  ws.on("connection", (ws, req) => {
    ws.clientId = url.parse(req.url, true).query.client_id

    sockets.add(ws)
    log.info({ws}, "client connected")

    ws.on("close", () => {
      sockets.remove(ws)
      log.info({ws}, "client disconnected")
    })

    ws.on("message", (message) => {
      try { message = JSON.parse(message) }
      catch (e) {}

      if (!message || !message.type) {
        log.info({ws, message}, "message could not be parsed")
        return
      }

      if (controller[message.type]) {
        log.info({ws, message}, "message received")
        controller[message.type](ws, message.data)
      }
      else {
        log.info({ws, message}, "message discarded")
      }
    })
  })

  setInterval(() => {
    const all = sockets.all()
    log.info({clientCount: all.length}, "ping")

    all.forEach((s) => {
      try { sockets.send(s.socket, "hi", { hi: "👋" }) }
      catch (e) {}
    })
  }, 30000)
}
