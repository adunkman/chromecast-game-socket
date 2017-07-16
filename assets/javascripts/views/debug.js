const Backbone = require("backbone")

module.exports = Backbone.View.extend({
  template: require("../templates/debug"),

  initialize() {
    this.listenTo(this.model, "change:id", this.render)
  },

  render() {
    this.$el.html(this.template(this.renderAttrs()))
  },

  renderAttrs() {
    return {
      room_id: this.model.id
    }
  }
})
