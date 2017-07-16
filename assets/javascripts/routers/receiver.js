const ReconnectingWebsocket = require("reconnectingwebsocket")

const RoomModel = require("../models/room")
const DebugView = require("../views/debug")

module.exports = class Receiver {
  constructor() {
    cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG)

    this.room = new RoomModel()

    this.startReceiver()
    this.startWebsocket()

    document.addEventListener("DOMContentLoaded", this.initializeViews.bind(this))
  }

  startReceiver() {
    this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance()
    this.castReceiverManager.start()
  }

  startWebsocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const host = window.location.host
    this.ws = new ReconnectingWebsocket(`${protocol}//${host}/receiver`)

    this.ws.addEventListener("open", () => {
      if (!this.room.id) {
        this.ws.send(JSON.stringify({type: "generate_room_id"}))
      }
    })

    this.ws.addEventListener("message", (evt) => {
      var message;
      try { message = JSON.parse(evt.data) }
      catch (e) {}

      if (!message || !message.type) { return }

      if (message.type === "room_id") {
        this.room.set("id", message.data.room_id)
      }
    })
  }

  initializeViews() {
    this.debugView = new DebugView({model: this.room})
    this.debugView.render()
    document.body.appendChild(this.debugView.el)
  }
}
