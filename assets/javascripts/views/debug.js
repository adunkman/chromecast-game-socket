const Backbone = require("backbone")

module.exports = Backbone.View.extend({
  template: require("../templates/debug"),

  initialize() {
    this.listenTo(this.model, "change", this.render)
  },

  render() {
    this.$el.html(this.template(this.renderAttrs()))
  },

  renderAttrs() {
    return {
      room_id: this.model.id,
      room_count: this.model.get("count")
    }
  }
})
