module.exports = class Receiver {
  constructor() {
    this.startReceiver()
  }

  startReceiver() {
    this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance()
    this.castReceiverManager.start()
  }

}
