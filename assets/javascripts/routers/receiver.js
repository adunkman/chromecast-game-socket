module.exports = class Receiver {

  startReceiver() {
    this.castReceiver = cast.receiver.CastReceiverManager.getInstance()
    this.castReceiver.start()
  }

}
