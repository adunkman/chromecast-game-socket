const LobbyView = require("../views/lobby")
const CastStateModel = require("../models/cast_state")
const RoomModel = require("../models/room")

module.exports = class Sender {
  constructor() {
    this.castState = new CastStateModel()
    this.room = new RoomModel({path: "/sender"})

    window.__onGCastApiAvailable = this.registerIfAvailable.bind(this)
    document.addEventListener("DOMContentLoaded", this.initializeViews.bind(this))
  }

  registerIfAvailable(isAvailable) {
    if (isAvailable) {
      this.registerApplication()
    }
    else {
      this.castState.frameworkUnavailabe()
    }
  }

  registerApplication() {
    this.castContext = cast.framework.CastContext.getInstance()
    this.castContext.setOptions({
      receiverApplicationId: "596B5B39",
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    })

    this.registerEventHanders()
  }

  registerEventHanders() {
    const types = cast.framework.CastContextEventType

    this.castState.setState(this.castContext.getCastState())
    this.castContext.addEventListener(types.CAST_STATE_CHANGED, (evt) => {
      this.castState.setState(evt.castState)
    })
  }

  initializeViews() {
    this.lobbyView = new LobbyView({
      castState: this.castState,
      room: this.room,
      router: this
    })
    this.lobbyView.render()
    document.body.appendChild(this.lobbyView.el)
  }

  requestSession() {
    if (!this.castContext) {
      return;
    }

    this.castContext.requestSession()
      .then((evt) => console.log("then", evt))
      .catch((evt) => console.log("catch", evt))
  }
}
