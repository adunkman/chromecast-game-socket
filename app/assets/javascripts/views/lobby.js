const Backbone = require("backbone")

const CastButtonView = require("./cast_button")
const RoomInputView = require("./room_input")

module.exports = Backbone.View.extend({
  template: require("../templates/lobby"),

  initialize({router, room, castState}) {
    this.castButton = new CastButtonView({
      model: castState,
      router: router
    })

    this.roomInput = new RoomInputView({
      model: room
    })
  },

  render() {
    this.$el.html(this.template())

    this.castButton.render()
    this.$(".js-cast-button").append(this.castButton.el)

    this.roomInput.render()
    this.$(".js-room-input").append(this.roomInput.el)
  }
})
