const Backbone = require("backbone")

const CastButtonView = require("./cast_button")

module.exports = Backbone.View.extend({
  template: require("../templates/lobby"),

  initialize({router}) {
    this.castButton = new CastButtonView({
      model: this.model,
      router: router
    })
  },

  render() {
    this.$el.html(this.template())
    this.castButton.render()
    this.$(".js-cast-button").append(this.castButton.el)
  }
})
