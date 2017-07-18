const ReconnectingWebsocket = require("reconnectingwebsocket")
const Backbone = require("backbone")

module.exports = Backbone.Model.extend({
  protocol: window.location.protocol === "https:" ? "wss:" : "ws:",
  host: window.location.host,

  initialize({path}) {
    this.ws = new ReconnectingWebsocket(`${this.protocol}//${this.host}${path}`)

    this.ws.addEventListener("open", this.joinIfIdSet.bind(this))
    this.ws.addEventListener("open", this.trigger.bind(this, "ws:open"))
    this.ws.addEventListener("close", this.trigger.bind(this, "ws:close"))
    this.ws.addEventListener("message", this.parseMessageAndTrigger.bind(this))

    this.on("change:id", this.joinIfIdSet.bind(this))
  },

  joinIfIdSet() {
    if (!this.id || this.ws.readyState !== WebSocket.OPEN) { return }
    this.ws.send(JSON.stringify({type: "join_room", data: { room_id: this.id }}))
  },

  parseMessageAndTrigger({data}) {
    var message;

    try { message = JSON.parse(data) }
    catch (e) { return console.error(e) }
    if (!message.type) { return }

    this.trigger(`ws:${message.type}`, message.data)
  },

  send(type, data = {}) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      this.once("ws:open", this.send.bind(this, type, data))
      return
    }

    this.ws.send(JSON.stringify({type, data}))
  }
})
