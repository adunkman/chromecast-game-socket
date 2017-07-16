module.exports = class Receiver {
  constructor() {
    cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG)
    this.startReceiver()
  }

  startReceiver() {
    this.castReceiverManager = cast.receiver.CastReceiverManager.getInstance()
    this.castReceiverManager.start()
  }

}
