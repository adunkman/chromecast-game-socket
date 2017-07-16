module.exports = class Sender {
  constructor() {
    window.__onGCastApiAvailable = this.registerIfAvailable.bind(this)
  }

  registerIfAvailable(isAvailable) {
    if (isAvailable) {
      this.registerApplication()
    }
  }

  registerApplication() {
    (this.castContext = cast.framework.CastContext.getInstance()).setOptions({
      receiverApplicationId: "596B5B39",
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    })
  }
}
