const Backbone = require("backbone")

module.exports = Backbone.View.extend({
  template: require("../templates/room_input"),

  tagName: "form",

  events: {
    "submit": "setRoomId"
  },

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
  },

  setRoomId(evt) {
    evt.preventDefault()
    this.model.set("id", this.$("input").val().trim())
  }
})
