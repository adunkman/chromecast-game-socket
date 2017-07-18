const Backbone = require("backbone")

module.exports = Backbone.Model.extend({
  states: {
    UNKNOWN: "UNKNOWN",
    NOT_CAPABLE: "NOT_CAPABLE",
    NO_DEVICES_AVAILABLE: "NO_DEVICES_AVAILABLE",
    NOT_CONNECTED: "NOT_CONNECTED",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED"
  },

  initialize() {
    this.set("state", this.states.UNKNOWN)
  },

  isConnecting() {
    return this.get("state") === this.states.CONNECTING
  },

  isCasting() {
    return this.get("state") === this.states.CONNECTED
  },

  canCast() {
    return this.get("state") === this.states.NOT_CONNECTED
  },

  isNotCapable() {
    return this.get("state") === this.states.NOT_CAPABLE
  },

  noDevicesFound() {
    return this.get("state") === this.states.NO_DEVICES_AVAILABLE
  },

  setState(castState) {
    switch (castState) {
      case cast.framework.CastState.NO_DEVICES_AVAILABLE:
        return this.set("state", this.states.NO_DEVICES_AVAILABLE)
      case cast.framework.CastState.NOT_CONNECTED:
        return this.set("state", this.states.NOT_CONNECTED)
      case cast.framework.CastState.CONNECTING:
        return this.set("state", this.states.CONNECTING)
      case cast.framework.CastState.CONNECTED:
        return this.set("state", this.states.CONNECTED)
      default:
        return this.set("state", this.states.UNKNOWN)
    }
  },

  frameworkUnavailabe() {
    this.set("state", this.states.NOT_CAPABLE)
  }
})
