const RoomModel = require("../models/room")
const DebugView = require("../views/debug")

module.exports = class Receiver {
  constructor() {
    cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG)

    this.room = new RoomModel({path: "/receiver"})
    this.room.on("ws:open", this.createRoomIfNeeded.bind(this))
    this.room.on("ws:room_id", this.setRoomId.bind(this))
    this.room.on("ws:room_count", this.setRoomCount.bind(this))

    this.startReceiver()

    document.addEventListener("DOMContentLoaded", this.initializeViews.bind(this))
  }

  startReceiver() {
    this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance()
    this.castReceiverManager.start()
  }

  createRoomIfNeeded() {
    if (!this.room.id) {
      this.room.send("generate_room_id")
    }
  }

  setRoomId(message) {
    this.room.set("id", message.room_id)
  }

  setRoomCount(message) {
    this.room.set("count", message.room_count)
  }

  initializeViews() {
    this.debugView = new DebugView({model: this.room})
    this.debugView.render()
    document.body.appendChild(this.debugView.el)
  }
}
