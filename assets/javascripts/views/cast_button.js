const Backbone = require("backbone")

module.exports = Backbone.View.extend({
  template: require("../templates/cast_button"),

  events: {
    "click": "castIfAvailable"
  },

  initialize({router}) {
    this.router = router
    this.listenTo(this.model, "change:state", this.render)
  },

  render() {
    this.$el.html(this.template(this.renderAttrs()))
  },

  renderAttrs() {
    return {
      is_casting: this.model.isCasting(),
      is_connecting: this.model.isConnecting(),
      can_cast: this.model.canCast(),
      device_is_not_capable: this.model.isNotCapable(),
      no_chromecast_devices_found: this.model.noDevicesFound()
    }
  },

  castIfAvailable() {
    if (!this.model.canCast()) { return; }
    this.router.requestSession()
  }
})
