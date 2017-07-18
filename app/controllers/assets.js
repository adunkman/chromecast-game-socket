module.exports = (app) => {

  app.get("/assets/index.js", require("connect-browserify")({
    entry: "app/assets/javascripts/index.js",
    extensions: [".js", ".hbs"],
    transforms: [
      require("hbsfy").configure({extensions: ["hbs"]})
    ],
    debug: process.env.NODE_ENV !== "production"
  }))

}
